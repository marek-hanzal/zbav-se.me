import { Effect } from "effect";
import { withCollectionApiFx } from "~/@seller-user/transaction/collection";
import { withCountApiFx } from "~/@seller-user/transaction/count";
import { withFetchApiFx } from "~/@seller-user/transaction/fetch";

export const withTransactionApiFx = Effect.fn("withTransactionApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withFetchApiFx(),
	]);
});
