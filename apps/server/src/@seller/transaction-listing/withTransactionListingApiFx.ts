import { Effect } from "effect";
import { withCollectionApiFx } from "~/@seller/transaction-listing/collection";
import { withCountApiFx } from "~/@seller/transaction-listing/count";
import { withFetchApiFx } from "~/@seller/transaction-listing/fetch";

export const withTransactionListingApiFx = Effect.fn("withTransactionListingApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withFetchApiFx(),
	]);
});
