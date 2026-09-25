import type { RenderedDestinationPlan } from '../core/types.js';
import { validateRenderedPlan } from '../core/render.js';
import { PublishingError } from './errors.js';
import {
  appendPendingAttempt,
  createAttemptId,
  createTransitionId,
  inspectPlanDisposition,
  markAttemptPublished,
  markAttemptRejected,
  recordKeyForPlan,
  requireOwnedPendingAttempt,
} from './ledger.js';
import type {
  BoundProvider,
  DestinationPublicationResult,
  PublishReleaseResult,
  PublicExecutionIdentity,
  PublishingStateRepository,
  StageEvent,
} from './types.js';

export interface PublishReleaseOptions {
  plans: readonly RenderedDestinationPlan[];
  providers: readonly BoundProvider[];
  state: PublishingStateRepository;
  execution: PublicExecutionIdentity;
  now?: () => string;
  monotonicNow?: () => number;
}

interface Candidate {
  plan: RenderedDestinationPlan;
  provider: BoundProvider;
  payload: unknown;
  result: DestinationPublicationResult;
}

function boundedDuration(start: number, end: number): number {
  const duration = Math.max(0, Math.round(end - start));
  return Math.min(duration, 86_400_000);
}

function event(
  events: StageEvent[],
  stage: StageEvent['stage'],
  status: StageEvent['status'],
  start: number,
  end: number,
  code?: string,
): void {
  const item: StageEvent = { stage, status, durationMs: boundedDuration(start, end) };
  if (code !== undefined) item.code = code.slice(0, 80);
  events.push(item);
}

function blankResult(plan: RenderedDestinationPlan): DestinationPublicationResult {
  return {
    destination: plan.destination,
    status: 'blocked',
    events: [],
  };
}

function providerFor(plan: RenderedDestinationPlan, providers: readonly BoundProvider[]): BoundProvider {
  const provider = providers.find((item) => item.destination === plan.destination);
  if (provider === undefined) {
    throw new PublishingError('provider_missing', `No provider is bound for ${plan.destination}.`);
  }
  return provider;
}

function statusCode(error: unknown): string {
  return error instanceof PublishingError ? error.code : 'unexpected_failure';
}

function isUncertainStateError(error: unknown): boolean {
  return (
    error instanceof PublishingError &&
    (error.code === 'state_uncertain' || error.code === 'attempt_unknown' || error.code === 'attempt_already_terminal')
  );
}

export async function publishRelease(options: PublishReleaseOptions): Promise<PublishReleaseResult> {
  const now = options.now ?? (() => new Date().toISOString());
  const monotonicNow = options.monotonicNow ?? (() => performance.now());

  const initialLedger = await options.state.read();
  const results: DestinationPublicationResult[] = [];
  const candidates: Candidate[] = [];
  let blocked = false;

  for (const rawPlan of options.plans) {
    const validateStart = monotonicNow();
    let plan: RenderedDestinationPlan;
    const result = blankResult(rawPlan);
    results.push(result);

    try {
      plan = validateRenderedPlan(rawPlan);
      const disposition = inspectPlanDisposition(initialLedger, plan);

      if (disposition.kind === 'already_published') {
        result.status = 'already_published';
        result.postId = disposition.providerId;
        result.postUrl = disposition.url;
        event(result.events, 'validate', 'skipped', validateStart, monotonicNow(), 'already_published');
        continue;
      }

      if (disposition.kind === 'unknown') {
        result.status = 'unknown';
        result.attemptNumber = disposition.attempt.attemptNumber;
        result.attemptId = disposition.attempt.attemptId;
        event(result.events, 'validate', 'blocked', validateStart, monotonicNow(), 'attempt_unknown');
        blocked = true;
        continue;
      }

      const provider = providerFor(plan, options.providers);
      const payload = provider.prepare(plan);
      const validation = provider.validate(payload);
      if (!validation.ok) {
        result.status = 'blocked';
        event(result.events, 'validate', 'failed', validateStart, monotonicNow(), 'provider_validation_failed');
        blocked = true;
        continue;
      }

      event(result.events, 'validate', 'ok', validateStart, monotonicNow());
      candidates.push({ plan, provider, payload, result });
    } catch (error: unknown) {
      result.status = error instanceof PublishingError && error.code === 'attempt_unknown' ? 'unknown' : 'blocked';
      event(result.events, 'validate', 'blocked', validateStart, monotonicNow(), statusCode(error));
      blocked = true;
    }
  }

  if (blocked) {
    for (const candidate of candidates) {
      candidate.result.status = 'blocked';
      event(
        candidate.result.events,
        'preflight',
        'skipped',
        monotonicNow(),
        monotonicNow(),
        'run_blocked_before_preflight',
      );
    }
    return { results };
  }

  let preflightFailed = false;
  for (const candidate of candidates) {
    const start = monotonicNow();
    try {
      const preflight = await candidate.provider.preflight(candidate.payload);
      if (preflight.status !== 'ready') {
        candidate.result.status = 'blocked';
        event(candidate.result.events, 'preflight', 'failed', start, monotonicNow(), 'preflight_rejected');
        preflightFailed = true;
      } else {
        event(candidate.result.events, 'preflight', 'ok', start, monotonicNow());
      }
    } catch {
      candidate.result.status = 'blocked';
      event(candidate.result.events, 'preflight', 'failed', start, monotonicNow(), 'preflight_failed');
      preflightFailed = true;
    }
  }

  if (preflightFailed) {
    for (const candidate of candidates) {
      if (candidate.result.events.some((item) => item.stage === 'preflight' && item.status === 'ok')) {
        candidate.result.status = 'blocked';
        event(candidate.result.events, 'pending', 'skipped', monotonicNow(), monotonicNow(), 'peer_preflight_failed');
      }
    }
    return { results };
  }

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    if (candidate === undefined) continue;

    const key = recordKeyForPlan(candidate.plan);
    const attemptId = createAttemptId();
    const pendingStart = monotonicNow();

    let attemptNumber: number;
    try {
      const attempt = await options.state.transition(
        {
          id: createTransitionId(),
          kind: 'append_pending',
          at: now(),
          recordKey: key,
          attemptId,
        },
        (current) => {
          const appended = appendPendingAttempt(current, candidate.plan, options.execution, attemptId, now());
          return { next: appended.ledger, value: appended.attempt };
        },
      );
      attemptNumber = attempt.attemptNumber;
      candidate.result.attemptNumber = attemptNumber;
      candidate.result.attemptId = attemptId;
      event(candidate.result.events, 'pending', 'ok', pendingStart, monotonicNow());
    } catch (error: unknown) {
      candidate.result.status = isUncertainStateError(error) ? 'unknown' : 'blocked';
      event(candidate.result.events, 'pending', 'failed', pendingStart, monotonicNow(), statusCode(error));
      blockRemaining(candidates, index + 1, monotonicNow, 'state_transition_failed');
      break;
    }

    const ownershipStart = monotonicNow();
    try {
      const current = await options.state.read();
      requireOwnedPendingAttempt(current, key, attemptNumber, attemptId, options.execution);
      event(candidate.result.events, 'ownership', 'ok', ownershipStart, monotonicNow());
    } catch (error: unknown) {
      candidate.result.status = 'unknown';
      event(candidate.result.events, 'ownership', 'failed', ownershipStart, monotonicNow(), statusCode(error));
      blockRemaining(candidates, index + 1, monotonicNow, 'attempt_ownership_lost');
      break;
    }

    const publishStart = monotonicNow();
    let publication;
    try {
      publication = await candidate.provider.publish(candidate.payload);
    } catch {
      candidate.result.status = 'unknown';
      event(candidate.result.events, 'publish', 'failed', publishStart, monotonicNow(), 'provider_threw');
      blockRemaining(candidates, index + 1, monotonicNow, 'unknown_provider_outcome');
      break;
    }

    if (publication.status === 'unknown') {
      candidate.result.status = 'unknown';
      event(candidate.result.events, 'publish', 'failed', publishStart, monotonicNow(), 'provider_outcome_unknown');
      blockRemaining(candidates, index + 1, monotonicNow, 'unknown_provider_outcome');
      break;
    }

    event(candidate.result.events, 'publish', 'ok', publishStart, monotonicNow(), publication.status);
    const outcomeStart = monotonicNow();

    try {
      if (publication.status === 'published') {
        await options.state.transition(
          {
            id: createTransitionId(),
            kind: 'record_published',
            at: now(),
            recordKey: key,
            attemptId,
          },
          (current) => ({
            next: markAttemptPublished(
              current,
              key,
              attemptNumber,
              attemptId,
              options.execution,
              publication.providerId,
              publication.url,
              now(),
            ),
            value: undefined,
          }),
        );
        candidate.result.status = 'published';
        candidate.result.postId = publication.providerId;
        candidate.result.postUrl = publication.url;
      } else {
        await options.state.transition(
          {
            id: createTransitionId(),
            kind: 'record_rejected',
            at: now(),
            recordKey: key,
            attemptId,
          },
          (current) => ({
            next: markAttemptRejected(
              current,
              key,
              attemptNumber,
              attemptId,
              options.execution,
              publication.retryClassification === 'retryable',
              now(),
            ),
            value: undefined,
          }),
        );
        candidate.result.status = 'rejected';
      }
      event(candidate.result.events, 'outcome', 'ok', outcomeStart, monotonicNow());
    } catch (error: unknown) {
      candidate.result.status = 'unknown';
      delete candidate.result.postId;
      delete candidate.result.postUrl;
      event(candidate.result.events, 'outcome', 'failed', outcomeStart, monotonicNow(), statusCode(error));
      blockRemaining(candidates, index + 1, monotonicNow, 'outcome_not_durably_recorded');
      break;
    }
  }

  return { results };
}

function blockRemaining(
  candidates: readonly Candidate[],
  startIndex: number,
  monotonicNow: () => number,
  code: string,
): void {
  for (let index = startIndex; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    if (candidate === undefined || candidate.result.status !== 'blocked') continue;
    const at = monotonicNow();
    event(candidate.result.events, 'pending', 'skipped', at, at, code);
  }
}
