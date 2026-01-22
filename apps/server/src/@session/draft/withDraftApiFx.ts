import { Effect } from "effect";
import { withCreateApiFx } from "./create";
import { withGalleryCreateApiFx } from "./gallery-create";

export const withDraftApiFx = Effect.fn("withDraftApiFx")(function* () {
	yield* Effect.all([
		withCreateApiFx(),
		withGalleryCreateApiFx(),
	]);
});
