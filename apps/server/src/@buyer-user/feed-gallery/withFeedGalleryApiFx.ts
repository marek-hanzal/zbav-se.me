import { Effect } from "effect";
import { withCreateApiFx } from "~/@buyer-user/feed-gallery/create";

export const withFeedGalleryApiFx = Effect.fn("withFeedGalleryApiFx")(function* () {
	yield* withCreateApiFx();
});
