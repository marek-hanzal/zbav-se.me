import { Effect } from "effect";
import { withCreateApiFx } from "./create";

export const withThumbApiFx = Effect.fn("withThumbApiFx")(function* () {
	yield* withCreateApiFx();
});
