import { Effect } from "effect";
import { withCollectionApiFx } from "~/@buyer/transaction/collection";
import { withCountApiFx } from "~/@buyer/transaction/count";
import { withCreateApiFx } from "~/@buyer/transaction/create";
import { withFetchApiFx } from "~/@buyer/transaction/fetch";

export const withTransactionApiFx = Effect.fn("withTransactionApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withCreateApiFx(),
		withFetchApiFx(),
	]);
});
