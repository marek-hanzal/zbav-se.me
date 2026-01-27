import { Effect } from "effect";
import { withCollectionApiFx } from "./collection";

export const withTransactionListingApiFx = Effect.fn("withTransactionListingApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
	]);
});
