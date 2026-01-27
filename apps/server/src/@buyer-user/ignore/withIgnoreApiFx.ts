import { Effect } from "effect";
import { withCollectionApiFx } from "./collection";
import { withCountApiFx } from "./count";
import { withToggleApiFx } from "./toggle";

export const withIgnoreApiFx = Effect.fn("withIgnoreApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withToggleApiFx(),
	]);
});
