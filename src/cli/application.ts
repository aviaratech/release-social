import { randomUUID } from 'node:crypto';

import { createReleasePlan, type CanonicalReleaseSource, type ReleaseSocialConfig, type RenderedDestinationPlan } from '../index.js';
import { GitHubExecutionQuiescenceVerifier, GitHubStateStore } from '../github/state-store.js';
import { bindProvider } from '../publishing/repository.js';
import {
  attemptLocator,
  createCliExecutionIdentity,
  createGitHubRunExecutionIdentity,
  locateAttempt,
  publishRelease,
  reconcileNonCreationAttempt,
  reconcilePublishedAttempt,
  reviseRejectedAttemptPlan,
  type BoundProvider,
  type PublicExecutionIdentity,
  type PublishingStateRepository,
} from '../publishing/index.js';
import { createLinkedInProvider, loadLinkedInCredentials } from '../providers/linkedin/index.js';
import { createXProvider, loadXCredentials } from '../providers/x/index.js';

export type EntryMode = 'validate' | 'preview' | 'publish';

export interface PreviewDestination {
  destination: 'x' | 'linkedin';
  account: string;
  text: string;
  digest: string;
  contentSource: string;
  diagnostics: readonly string[];
  validation: { ok: boolean; errors: readonly string[] };
}

export interface PreparedRelease {
  status: 'ready' | 'skipped';
  skipReason?: string;
  destinations: readonly PreviewDestination[];
  plans: readonly RenderedDestinationPlan[];
}

export interface PublishApplicationOptions {
  source: CanonicalReleaseSource;
  config: ReleaseSocialConfig | unknown;
  repository: string;
  githubToken: string;
  execution: PublicExecutionIdentity;
  env?: NodeJS.ProcessEnv;
  fetch?: typeof fetch;
  state?: PublishingStateRepository;
  bindings?: readonly BoundProvider[];
}

export interface EntryResult {
  aggregate: 'success' | 'skipped' | 'partial' | 'unknown' | 'failed';
  prepared: PreparedRelease;
  publications?: Awaited<ReturnType<typeof publishRelease>>['results'];
}

function accountLabel(plan: RenderedDestinationPlan): string {
  return plan.account.destination === 'x' ? plan.account.accountId : plan.account.author;
}

function contentDiagnostics(plan: RenderedDestinationPlan): string[] {
  if (plan.textSource.kind !== 'github_release_notes') return [];
  const diagnostics = [`included_entries=${plan.textSource.includedEntries}`];
  diagnostics.push(`omitted_entries=${plan.textSource.omittedEntries}`);
  diagnostics.push(`omission_reason=${plan.textSource.omissionReason}`);
  return diagnostics;
}

function contentSource(plan: RenderedDestinationPlan): string {
  if (plan.textSource.kind === 'github_release_notes') return 'github-release-notes';
  if (plan.textSource.kind === 'provider_override') return 'provider-override';
  return `${plan.textSource.kind.replaceAll('_', '-') }:${plan.textSource.variant}`;
}

export function prepareRelease(source: CanonicalReleaseSource, config: ReleaseSocialConfig | unknown): PreparedRelease {
  const planned = createReleasePlan(source, config);
  if (planned.status === 'skipped') {
    return { status: 'skipped', skipReason: planned.reason, destinations: [], plans: [] };
  }

  const destinations: PreviewDestination[] = planned.plans.map((plan) => {
    if (plan.destination === 'x') {
      const provider = createXProvider();
      const payload = provider.prepare(plan);
      const validation = provider.validate(payload);
      return {
        destination: 'x',
        account: accountLabel(plan),
        text: plan.text,
        digest: plan.digest,
        contentSource: contentSource(plan),
        diagnostics: contentDiagnostics(plan),
        validation: validation.ok ? { ok: true, errors: [] } : { ok: false, errors: validation.errors },
      };
    }

    const provider = createLinkedInProvider();
    const payload = provider.prepare(plan);
    const validation = provider.validate(payload);
    return {
      destination: 'linkedin',
      account: accountLabel(plan),
      text: plan.text,
      digest: plan.digest,
      contentSource: contentSource(plan),
      diagnostics: contentDiagnostics(plan),
      validation: validation.ok ? { ok: true, errors: [] } : { ok: false, errors: validation.errors },
    };
  });

  return { status: 'ready', destinations, plans: planned.plans };
}

export async function publishPrepared(options: PublishApplicationOptions): Promise<EntryResult> {
  const prepared = prepareRelease(options.source, options.config);
  if (prepared.status === 'skipped') return { aggregate: 'skipped', prepared };

  if (prepared.destinations.some((destination) => !destination.validation.ok)) {
    return { aggregate: 'failed', prepared };
  }

  const env = options.env ?? process.env;
  const bindings =
    options.bindings ??
    prepared.plans.map((plan) => {
      if (plan.destination === 'x') {
        return bindProvider({
          provider: createXProvider(options.fetch === undefined ? {} : { fetch: options.fetch }),
          credentials: loadXCredentials(env),
        });
      }
      return bindProvider({
        provider: createLinkedInProvider(options.fetch === undefined ? {} : { fetch: options.fetch }),
        credentials: loadLinkedInCredentials(env),
      });
    });

  const state =
    options.state ??
    new GitHubStateStore({
      repository: options.repository,
      token: options.githubToken,
      ...(options.fetch === undefined ? {} : { fetch: options.fetch }),
    });
  const publications = (
    await publishRelease({
      plans: prepared.plans,
      providers: bindings,
      state,
      execution: options.execution,
    })
  ).results;

  const statuses = publications.map((item) => item.status);
  let aggregate: EntryResult['aggregate'] = 'success';
  if (statuses.some((status) => status === 'unknown')) aggregate = 'unknown';
  else if (statuses.some((status) => status === 'rejected' || status === 'blocked')) aggregate = 'partial';

  return { aggregate, prepared, publications };
}

export async function initializePublishingState(
  repository: string,
  githubToken: string,
  fetcher?: typeof fetch,
): Promise<void> {
  await new GitHubStateStore({ repository, token: githubToken, ...(fetcher === undefined ? {} : { fetch: fetcher }) }).initialize();
}

export interface ReconcileRequest {
  repository: string;
  githubToken: string;
  recordKey: string;
  attemptNumber: number;
  attemptId: string;
  resolution: 'published' | 'non-creation';
  providerId?: string;
  url?: string;
  cliSettled?: boolean;
  fetch?: typeof fetch;
}

export async function reconcileAttempt(request: ReconcileRequest): Promise<void> {
  const state = new GitHubStateStore({
    repository: request.repository,
    token: request.githubToken,
    ...(request.fetch === undefined ? {} : { fetch: request.fetch }),
  });
  const verifier = new GitHubExecutionQuiescenceVerifier({
    token: request.githubToken,
    ...(request.fetch === undefined ? {} : { fetch: request.fetch }),
  });
  const attempt = attemptLocator(request.recordKey, request.attemptNumber, request.attemptId);
  const cliAttestation = request.cliSettled ? { processStoppedAndRequestsSettled: true as const } : undefined;

  if (request.resolution === 'published') {
    if (!request.providerId || !request.url) throw new Error('Published reconciliation requires providerId and url.');
    await reconcilePublishedAttempt({
      state,
      verifier,
      attempt,
      providerId: request.providerId,
      url: request.url,
      confirmedPublicPost: true,
      ...(cliAttestation === undefined ? {} : { cliAttestation }),
    });
    return;
  }

  await reconcileNonCreationAttempt({
    state,
    verifier,
    attempt,
    confirmedNonCreation: true,
    ...(cliAttestation === undefined ? {} : { cliAttestation }),
  });
}

export interface ReviseRequest {
  repository: string;
  githubToken: string;
  recordKey: string;
  attemptNumber: number;
  attemptId: string;
  oldDigest: string;
  newPlan: RenderedDestinationPlan;
  execution: PublicExecutionIdentity;
  fetch?: typeof fetch;
}

export async function reviseAttempt(request: ReviseRequest): Promise<void> {
  const state = new GitHubStateStore({
    repository: request.repository,
    token: request.githubToken,
    ...(request.fetch === undefined ? {} : { fetch: request.fetch }),
  });
  const ledger = await state.read();
  const located = locateAttempt(ledger, request.recordKey, request.attemptNumber, request.attemptId);
  if (located.attempt.payloadDigest !== request.oldDigest) {
    throw new Error('The supplied old digest does not match the exact rejected attempt.');
  }

  await reviseRejectedAttemptPlan({
    state,
    attempt: attemptLocator(request.recordKey, request.attemptNumber, request.attemptId),
    newPlan: request.newPlan,
    execution: request.execution,
    confirmedRevision: true,
  });
}

export function cliExecution(invocationId = randomUUID()): PublicExecutionIdentity {
  return createCliExecutionIdentity(invocationId);
}

export function actionExecution(repository: string, runId: number): PublicExecutionIdentity {
  return createGitHubRunExecutionIdentity(repository, runId);
}
