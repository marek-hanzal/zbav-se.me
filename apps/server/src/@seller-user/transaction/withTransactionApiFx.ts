import { Effect } from "effect";
import { withCollectionApiFx } from "~/@seller-user/transaction/collection";
import { withFetchApiFx } from "~/@seller-user/transaction/fetch";

export const withTransactionApiFx = Effect.fn("withTransactionApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withFetchApiFx(),
	]);
});
