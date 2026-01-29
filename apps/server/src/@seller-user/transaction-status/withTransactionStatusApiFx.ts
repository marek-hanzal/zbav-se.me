import { Effect } from "effect";
import { withAcceptApiFx } from "~/@seller-user/transaction-status/accept";
import { withDisputeApiFx } from "~/@seller-user/transaction-status/dispute";
import { withRejectApiFx } from "~/@seller-user/transaction-status/reject";
import { withResolveApiFx } from "~/@seller-user/transaction-status/resolve";

export const withTransactionStatusApiFx = Effect.fn("withTransactionStatusApiFx")(function* () {
	yield* Effect.all([
		withAcceptApiFx(),
		withDisputeApiFx(),
		withRejectApiFx(),
		withResolveApiFx(),
	]);
});
