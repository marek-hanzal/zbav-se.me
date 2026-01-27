import { Effect } from "effect";
import { withCollectionApiFx } from "./collection";
import { withCountApiFx } from "./count";
import { withToggleApiFx } from "./toggle";

export const withFlagApiFx = Effect.fn("withFlagApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withToggleApiFx(),
	]);
});
