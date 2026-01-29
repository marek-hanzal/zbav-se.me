import { Effect } from "effect";
import { withCollectionApiFx } from "~/@buyer-user/ignore/collection";
import { withCountApiFx } from "~/@buyer-user/ignore/count";
import { withToggleApiFx } from "~/@buyer-user/ignore/toggle";

export const withIgnoreApiFx = Effect.fn("withIgnoreApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withToggleApiFx(),
	]);
});
