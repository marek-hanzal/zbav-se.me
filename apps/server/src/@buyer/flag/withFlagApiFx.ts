import { Effect } from "effect";
import { withCollectionApiFx } from "~/@buyer/flag/collection";
import { withCountApiFx } from "~/@buyer/flag/count";
import { withToggleApiFx } from "~/@buyer/flag/toggle";

export const withFlagApiFx = Effect.fn("withFlagApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withToggleApiFx(),
	]);
});
