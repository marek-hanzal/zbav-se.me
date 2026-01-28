import { Effect } from "effect";
import { withCollectionApiFx } from "~/@seller-user/transaction-listing/collection";

export const withTransactionListingApiFx = Effect.fn("withTransactionListingApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
	]);
});
