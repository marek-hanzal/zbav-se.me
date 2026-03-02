import { Effect } from "effect";
import { withCollectionApiFx } from "~/@seller/listing/collection";
import { withCountApiFx } from "~/@seller/listing/count";
import { withCreateApiFx } from "~/@seller/listing/create";
import { withFetchApiFx } from "~/@seller/listing/fetch";

export const withListingApiFx = Effect.fn("withListingApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withCreateApiFx(),
		withFetchApiFx(),
	]);
});
