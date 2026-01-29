import { Effect } from "effect";
import { withCategoryCollectionApiFx } from "~/@session/category/collection";
import { withCategoryCountApiFx } from "~/@session/category/count";
import { withCategoryFetchApiFx } from "~/@session/category/fetch";

export const withCategoryApiFx = Effect.fn("withCategoryApiFx")(function* () {
	yield* Effect.all([
		withCategoryFetchApiFx(),
		withCategoryCollectionApiFx(),
		withCategoryCountApiFx(),
	]);
});
