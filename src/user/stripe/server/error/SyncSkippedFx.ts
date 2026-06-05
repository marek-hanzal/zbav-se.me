import { Data } from "effect";

export namespace SyncSkippedFx {
	export type Reason =
		| "one-off already fulfilled"
		| "one-off purchase bundle missing"
		| "source bundle empty"
		| "source bundle missing"
		| "checkout user missing"
		| "subscription bundle missing"
		| "subscription customer missing"
		| "subscription metadata missing";
}

/**
 * Explicit no-op signal for Stripe sync paths.
 *
 * A skipped sync is not a successful state with a boolean flag. It is a domain
 * outcome that callers either handle as a webhook no-op or let bubble in direct
 * tests/tools where the missing prerequisite matters.
 */
export class SyncSkippedFx extends Data.TaggedError("SyncSkippedFx")<{
	message: string;
	reason: SyncSkippedFx.Reason;
	cause?: unknown;
}> {}
