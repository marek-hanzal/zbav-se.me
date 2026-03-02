import { Effect } from "effect";
import { withCloseApiFx } from "~/@buyer/transaction-status/close";
import { withDisputeApiFx } from "~/@buyer/transaction-status/dispute";
import { withRejectApiFx } from "~/@buyer/transaction-status/reject";
import { withSuccessApiFx } from "~/@buyer/transaction-status/success";

export const withTransactionStatusApiFx = Effect.fn("withTransactionStatusApiFx")(function* () {
	yield* Effect.all([
		withCloseApiFx(),
		withDisputeApiFx(),
		withRejectApiFx(),
		withSuccessApiFx(),
	]);
});
