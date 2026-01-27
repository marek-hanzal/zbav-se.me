import { Effect } from "effect";
import { withCreateApiFx } from "./create";

export const withFeedGalleryApiFx = Effect.fn("withFeedGalleryApiFx")(function* () {
	yield* withCreateApiFx();
});
