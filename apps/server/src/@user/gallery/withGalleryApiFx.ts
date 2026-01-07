import { Effect } from "effect";
import { withCollectionApiFx } from "./collection";
import { withCountApiFx } from "./count";
import { withFetchApiFx } from "./fetch";

export const withGalleryApiFx = Effect.fn("withGalleryApiFx")(function* () {
	yield* Effect.all([
		withFetchApiFx(),
		withCollectionApiFx(),
		withCountApiFx(),
	]);
});
