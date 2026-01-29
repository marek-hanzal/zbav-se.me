import { Effect } from "effect";
import { withCollectionApiFx } from "~/@buyer-user/listing/collection";
import { withCountApiFx } from "~/@buyer-user/listing/count";
import { withFetchApiFx } from "~/@buyer-user/listing/fetch";

export const withListingApiFx = Effect.fn("withListingApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withFetchApiFx(),
	]);
});
