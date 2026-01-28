import { Effect } from "effect";
import { withCreateApiFx } from "~/@seller-user/draft-gallery/create";

export const withDraftGalleryApiFx = Effect.fn("withDraftGalleryApiFx")(function* () {
	yield* withCreateApiFx();
});
