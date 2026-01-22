import { Effect } from "effect";
import { withCollectionApiFx } from "./collection";
import { withSellerInfoApiFx } from "./seller-info";

export const withListingApiFx = Effect.fn("withListingApiFx")(function* () {
	yield* Effect.all([
		withSellerInfoApiFx(),
		withCollectionApiFx(),
	]);
});
