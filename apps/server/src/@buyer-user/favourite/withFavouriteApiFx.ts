import { Effect } from "effect";
import { withCollectionApiFx } from "~/@buyer-user/favourite/collection";
import { withCountApiFx } from "~/@buyer-user/favourite/count";
import { withToggleApiFx } from "~/@buyer-user/favourite/toggle";

export const withFavouriteApiFx = Effect.fn("withFavouriteApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withToggleApiFx(),
	]);
});
