import { Data } from "effect";

/**
 * Explicit no-op signal for Stripe sync paths.
 *
 * A skipped sync is not a successful state with a boolean flag. It is a domain
 * outcome that callers either handle as a webhook no-op or let bubble in direct
 * tests/tools where the missing prerequisite matters.
 */
export class SyncSkipErrorFx extends Data.TaggedError("SyncSkipErrorFx")<{
	message: string;
	reason: string;
	cause?: unknown;
}> {}
