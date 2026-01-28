import { Effect } from "effect";
import { withCollectionApiFx } from "~/@buyer-user/flag/collection";
import { withCountApiFx } from "~/@buyer-user/flag/count";
import { withToggleApiFx } from "~/@buyer-user/flag/toggle";

export const withFlagApiFx = Effect.fn("withFlagApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withToggleApiFx(),
	]);
});
