import { Effect } from "effect";
import { withCollectionApiFx } from "~/@buyer/favourite/collection";
import { withCountApiFx } from "~/@buyer/favourite/count";
import { withToggleApiFx } from "~/@buyer/favourite/toggle";

export const withFavouriteApiFx = Effect.fn("withFavouriteApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withToggleApiFx(),
	]);
});
