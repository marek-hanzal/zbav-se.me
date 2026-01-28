import { Effect } from "effect";
import { withCloseApiFx } from "~/@buyer-user/transaction-status/close";
import { withDisputeApiFx } from "~/@buyer-user/transaction-status/dispute";
import { withRejectApiFx } from "~/@buyer-user/transaction-status/reject";
import { withSuccessApiFx } from "~/@buyer-user/transaction-status/success";

export const withTransactionStatusApiFx = Effect.fn("withTransactionStatusApiFx")(function* () {
	yield* Effect.all([
		withCloseApiFx(),
		withDisputeApiFx(),
		withRejectApiFx(),
		withSuccessApiFx(),
	]);
});
