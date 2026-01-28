import { Effect } from "effect";
import { withAcceptApiFx } from "~/@seller-user/transaction-status/accept";
import { withResolveApiFx } from "~/@seller-user/transaction-status/resolve";

export const withTransactionStatusApiFx = Effect.fn("withTransactionStatusApiFx")(function* () {
	yield* Effect.all([
		withAcceptApiFx(),
		withResolveApiFx(),
	]);
});
