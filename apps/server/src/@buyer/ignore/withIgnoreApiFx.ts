import { Effect } from "effect";
import { withCollectionApiFx } from "~/@buyer/ignore/collection";
import { withCountApiFx } from "~/@buyer/ignore/count";
import { withToggleApiFx } from "~/@buyer/ignore/toggle";

export const withIgnoreApiFx = Effect.fn("withIgnoreApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withToggleApiFx(),
	]);
});
