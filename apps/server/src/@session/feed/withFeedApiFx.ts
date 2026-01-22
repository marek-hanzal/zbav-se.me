import { Effect } from "effect";
import { withCreateApiFx } from "./create";
import { withGalleryCreateApiFx } from "./gallery-create";

export const withFeedApiFx = Effect.fn("withFeedApiFx")(function* () {
	yield* Effect.all([
		withCreateApiFx(),
		withGalleryCreateApiFx(),
	]);
});
