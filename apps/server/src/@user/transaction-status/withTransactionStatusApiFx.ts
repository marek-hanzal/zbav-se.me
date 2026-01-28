import { Effect } from "effect";
import { withDisputeApiFx } from "~/@user/transaction-status/dispute";
import { withRejectApiFx } from "~/@user/transaction-status/reject";

export const withTransactionStatusApiFx = Effect.fn("withTransactionStatusApiFx")(function* () {
	yield* Effect.all([
		withRejectApiFx(),
		withDisputeApiFx(),
	]);
});
