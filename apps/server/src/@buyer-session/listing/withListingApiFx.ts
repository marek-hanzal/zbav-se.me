import { Effect } from "effect";
import { withCollectionApiFx } from "./collection";
import { withCountApiFx } from "./count";
import { withFetchApiFx } from "./fetch";

export const withListingApiFx = Effect.fn("withListingApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withFetchApiFx(),
	]);
});
