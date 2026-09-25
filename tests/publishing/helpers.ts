import type {
  Destination,
  ProviderPreflightResult,
  PublicationResult,
  RenderedDestinationPlan,
} from '../../src/core/types.js';
import { createReleasePlan, type CanonicalReleaseSource } from '../../src/index.js';
import { PublishingError } from '../../src/publishing/errors.js';
import { appendTransition, cloneLedger, createEmptyLedger, validateLedger } from '../../src/publishing/ledger.js';
import type {
  BoundProvider,
  ExecutionQuiescenceVerifier,
  PublicExecutionIdentity,
  PublishingLedgerV1,
  PublishingStateRepository,
  StateMutation,
  StateTransitionMetadata,
} from '../../src/publishing/types.js';

export const REPOSITORY = 'fictional/release-consumer';
export const REPOSITORY_ID = 424242;
export const RELEASE_ID = 515151;
export const RELEASE_URL = 'https://github.com/fictional/release-consumer/releases/tag/v1.0.0';
export const X_ACCOUNT_ID = '123456789012345678';
export const LINKEDIN_AUTHOR = 'urn:li:person:FictionalMember123';

export function releaseSource(body: string): CanonicalReleaseSource {
  return {
    repositoryId: REPOSITORY_ID,
    repository: REPOSITORY,
    releaseId: RELEASE_ID,
    tag: 'v1.0.0',
    releaseUrl: RELEASE_URL,
    body,
    draft: false,
    prerelease: false,
    visibility: 'public',
  };
}

function body(xText: string, linkedInText: string): string {
  return [
    '<!-- release-social:v1 -->',
    '',
    '<!-- announcement:start -->',
    'Fictional release announcement.',
    '<!-- announcement:end -->',
    '',
    '## Highlights',
    '- Synthetic publishing-state fixture.',
    '',
    '## Upgrade notes',
    'No breaking changes.',
    '',
    '<!-- social:short',
    xText,
    '-->',
    '<!-- social:linkedin',
    linkedInText,
    '-->',
    '',
  ].join('\n');
}

export function createPlans(
  options: {
    xText?: string;
    linkedInText?: string;
    linkedInVersion?: string;
    xAccountId?: string;
    linkedInAuthor?: string;
    includeX?: boolean;
    includeLinkedIn?: boolean;
  } = {},
): RenderedDestinationPlan[] {
  const xText = options.xText ?? 'Fictional X release.';
  const linkedInText = options.linkedInText ?? 'Fictional LinkedIn release.';
  const destinations: {
    x?: { accountId: string };
    linkedin?: { author: string; apiVersion: string };
  } = {};
  if (options.includeX !== false) destinations.x = { accountId: options.xAccountId ?? X_ACCOUNT_ID };
  if (options.includeLinkedIn !== false) {
    destinations.linkedin = {
      author: options.linkedInAuthor ?? LINKEDIN_AUTHOR,
      apiVersion: options.linkedInVersion ?? '202609',
    };
  }

  const result = createReleasePlan(releaseSource(body(xText, linkedInText)), {
    version: 1,
    destinations,
  });
  if (result.status !== 'ready') throw new Error('Synthetic plans unexpectedly skipped.');
  return [...result.plans];
}

export class MemoryStateRepository implements PublishingStateRepository {
  ledger: PublishingLedgerV1;
  failBeforeKinds = new Set<string>();
  failAfterKinds = new Set<string>();

  constructor(ledger: PublishingLedgerV1 = createEmptyLedger()) {
    this.ledger = validateLedger(ledger);
  }

  async read(): Promise<PublishingLedgerV1> {
    return cloneLedger(this.ledger);
  }

  async transition<T>(
    metadata: StateTransitionMetadata,
    apply: (current: PublishingLedgerV1) => StateMutation<T>,
  ): Promise<T> {
    if (this.failBeforeKinds.has(metadata.kind)) {
      throw new PublishingError('state_conflict', `Synthetic failure before ${metadata.kind}.`);
    }

    const mutation = apply(await this.read());
    this.ledger = appendTransition(mutation.next, metadata);
    validateLedger(this.ledger);

    if (this.failAfterKinds.has(metadata.kind)) {
      throw new PublishingError('state_uncertain', `Synthetic uncertain result after ${metadata.kind}.`);
    }

    return mutation.value;
  }
}

export interface FakeProviderOptions {
  destination: Destination;
  preflight?: ProviderPreflightResult;
  publications?: Array<PublicationResult | Error>;
  calls?: string[];
}

export class FakeProvider implements BoundProvider {
  readonly destination: Destination;
  readonly calls: string[];
  preflightResult: ProviderPreflightResult;
  publications: Array<PublicationResult | Error>;
  publishCount = 0;
  preflightCount = 0;

  constructor(options: FakeProviderOptions) {
    this.destination = options.destination;
    this.calls = options.calls ?? [];
    this.preflightResult = options.preflight ?? { status: 'ready' };
    this.publications = options.publications ?? [];
  }

  prepare(plan: RenderedDestinationPlan): unknown {
    this.calls.push(`${this.destination}:prepare`);
    return { text: plan.text, digest: plan.digest };
  }

  validate(_payload: unknown) {
    this.calls.push(`${this.destination}:validate`);
    return { ok: true } as const;
  }

  async preflight(_payload: unknown): Promise<ProviderPreflightResult> {
    this.preflightCount += 1;
    this.calls.push(`${this.destination}:preflight`);
    return this.preflightResult;
  }

  async publish(_payload: unknown): Promise<PublicationResult> {
    this.publishCount += 1;
    this.calls.push(`${this.destination}:publish`);
    const result = this.publications.shift();
    if (result instanceof Error) throw result;
    if (result !== undefined) return result;

    if (this.destination === 'x') {
      return {
        status: 'published',
        providerId: '987654321098765432',
        url: 'https://x.com/i/web/status/987654321098765432',
      };
    }
    return {
      status: 'published',
      providerId: 'urn:li:share:987654321098765433',
      url: 'https://www.linkedin.com/feed/update/urn:li:share:987654321098765433',
    };
  }
}

export class FakeQuiescenceVerifier implements ExecutionQuiescenceVerifier {
  active = false;
  calls: PublicExecutionIdentity[] = [];

  async verify(
    execution: PublicExecutionIdentity,
    cliAttestation?: { processStoppedAndRequestsSettled: true },
  ): Promise<void> {
    this.calls.push(execution);
    if (execution.kind === 'cli' && cliAttestation?.processStoppedAndRequestsSettled !== true) {
      throw new PublishingError('execution_not_quiescent', 'Synthetic CLI attestation missing.');
    }
    if (this.active) {
      throw new PublishingError('execution_not_quiescent', 'Synthetic execution remains active.');
    }
  }
}

export function fixedClock(): {
  now: () => string;
  monotonicNow: () => number;
} {
  let tick = 0;
  return {
    now: () => {
      tick += 1;
      return new Date(Date.UTC(2026, 8, 25, 20, 0, tick)).toISOString();
    },
    monotonicNow: () => {
      tick += 1;
      return tick;
    },
  };
}
