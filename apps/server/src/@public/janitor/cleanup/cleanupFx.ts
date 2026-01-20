import { Effect } from "effect";
import { cleanupCategoryFx } from "./cleanupCategoryFx";
import { cleanupScoreFx } from "./cleanupScoreFx";
import { cleanupUploadFx } from "./cleanupUploadFx";

export const cleanupFx = Effect.fn("cleanupFx")(function* () {
	return yield* Effect.all([
		cleanupCategoryFx(),
		cleanupScoreFx(),
		cleanupUploadFx(),
	]);
});
