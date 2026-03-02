import { Effect } from "effect";
import { withAcceptApiFx } from "~/@seller/transaction-status/accept";
import { withDisputeApiFx } from "~/@seller/transaction-status/dispute";
import { withRejectApiFx } from "~/@seller/transaction-status/reject";
import { withResolveApiFx } from "~/@seller/transaction-status/resolve";

export const withTransactionStatusApiFx = Effect.fn("withTransactionStatusApiFx")(function* () {
	yield* Effect.all([
		withAcceptApiFx(),
		withDisputeApiFx(),
		withRejectApiFx(),
		withResolveApiFx(),
	]);
});
