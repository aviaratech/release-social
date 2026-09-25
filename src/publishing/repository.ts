import type { BoundProvider, PublisherBinding, PublishingStateRepository } from './types.js';

export function bindProvider<Credentials, Payload>(binding: PublisherBinding<Credentials, Payload>): BoundProvider {
  const { provider, credentials } = binding;
  return {
    destination: provider.destination,
    prepare: (plan) => provider.prepare(plan),
    validate: (payload) => provider.validate(payload as Payload),
    preflight: (payload) => provider.preflight(credentials, payload as Payload),
    publish: (payload) => provider.publish(credentials, payload as Payload),
  };
}

export type { PublishingStateRepository };
