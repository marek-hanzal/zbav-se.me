import { Effect } from "effect";
import { withCollectionApiFx } from "~/@buyer/listing/collection";
import { withCountApiFx } from "~/@buyer/listing/count";
import { withFetchApiFx } from "~/@buyer/listing/fetch";
import { withSellerInfoApiFx } from "~/@buyer/listing/seller-info";

export const withListingApiFx = Effect.fn("withListingApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withFetchApiFx(),
		withSellerInfoApiFx(),
	]);
});
