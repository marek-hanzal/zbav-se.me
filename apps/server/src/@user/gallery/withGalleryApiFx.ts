import { Effect } from "effect";
import { withCollectionApiFx } from "~/@user/gallery/collection";
import { withCountApiFx } from "~/@user/gallery/count";
import { withFetchApiFx } from "~/@user/gallery/fetch";

export const withGalleryApiFx = Effect.fn("withGalleryApiFx")(function* () {
	yield* Effect.all([
		withFetchApiFx(),
		withCollectionApiFx(),
		withCountApiFx(),
	]);
});
