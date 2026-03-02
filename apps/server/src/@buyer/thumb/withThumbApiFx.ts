import { Effect } from "effect";
import { withCreateApiFx } from "~/@buyer/thumb/create";

export const withThumbApiFx = Effect.fn("withThumbApiFx")(function* () {
	yield* withCreateApiFx();
});
