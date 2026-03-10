import { Effect } from "effect";
import { withCloseApiFx } from "~/@buyer/transaction/close";
import { withCollectionApiFx } from "~/@buyer/transaction/collection";
import { withCountApiFx } from "~/@buyer/transaction/count";
import { withCreateApiFx } from "~/@buyer/transaction/create";
import { withDisputeApiFx } from "~/@buyer/transaction/dispute";
import { withFetchApiFx } from "~/@buyer/transaction/fetch";
import { withRejectApiFx } from "~/@buyer/transaction/reject";
import { withSuccessApiFx } from "~/@buyer/transaction/success";

export const withTransactionApiFx = Effect.fn("withTransactionApiFx")(function* () {
	yield* Effect.all([
		withCloseApiFx(),
		withCollectionApiFx(),
		withCountApiFx(),
		withCreateApiFx(),
		withDisputeApiFx(),
		withFetchApiFx(),
		withRejectApiFx(),
		withSuccessApiFx(),
	]);
});
