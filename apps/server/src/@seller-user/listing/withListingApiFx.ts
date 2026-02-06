import { Effect } from "effect";
import { withCollectionApiFx } from "~/@seller-user/listing/collection";
import { withCountApiFx } from "~/@seller-user/listing/count";
import { withCreateApiFx } from "~/@seller-user/listing/create";
import { withFetchApiFx } from "~/@seller-user/listing/fetch";

export const withListingApiFx = Effect.fn("withListingApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withCreateApiFx(),
		withFetchApiFx(),
	]);
});
