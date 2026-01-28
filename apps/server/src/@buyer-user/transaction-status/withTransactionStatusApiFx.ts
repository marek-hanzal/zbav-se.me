import { Effect } from "effect";
import { withCloseApiFx } from "~/@buyer-user/transaction-status/close";
import { withSuccessApiFx } from "~/@buyer-user/transaction-status/success";

export const withTransactionStatusApiFx = Effect.fn("withTransactionStatusApiFx")(function* () {
	yield* Effect.all([
		withCloseApiFx(),
		withSuccessApiFx(),
	]);
});
