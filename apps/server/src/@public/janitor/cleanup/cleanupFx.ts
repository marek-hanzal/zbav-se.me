import { Effect } from "effect";
import { cleanupCategoryFx } from "~/@public/janitor/cleanup/cleanupCategoryFx";
import { cleanupScoreFx } from "~/@public/janitor/cleanup/cleanupScoreFx";
import { cleanupTransactionFx } from "~/@public/janitor/cleanup/cleanupTransactionFx";
import { cleanupUploadFx } from "~/@public/janitor/cleanup/cleanupUploadFx";

export const cleanupFx = Effect.fn("cleanupFx")(function* () {
	return yield* Effect.all([
		cleanupCategoryFx(),
		cleanupScoreFx(),
		cleanupTransactionFx(),
		cleanupUploadFx(),
	]);
});
