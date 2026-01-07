import { Effect } from "effect";
import { withCategoryCollectionApiFx } from "./collection";
import { withCategoryCountApiFx } from "./count";
import { withCategoryFetchApiFx } from "./fetch";

export const withCategoryApiFx = Effect.fn("withCategoryApiFx")(function* () {
	yield* Effect.all([
		withCategoryFetchApiFx(),
		withCategoryCollectionApiFx(),
		withCategoryCountApiFx(),
	]);
});
