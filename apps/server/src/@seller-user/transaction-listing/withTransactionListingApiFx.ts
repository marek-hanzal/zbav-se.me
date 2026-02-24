import { Effect } from "effect";
import { withCollectionApiFx } from "~/@seller-user/transaction-listing/collection";
import { withCountApiFx } from "~/@seller-user/transaction-listing/count";
import { withFetchApiFx } from "~/@seller-user/transaction-listing/fetch";

export const withTransactionListingApiFx = Effect.fn("withTransactionListingApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withFetchApiFx(),
	]);
});
