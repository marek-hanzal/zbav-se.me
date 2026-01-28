import { Effect } from "effect";
import { withCreateApiFx } from "~/@buyer-user/thumb/create";

export const withThumbApiFx = Effect.fn("withThumbApiFx")(function* () {
	yield* withCreateApiFx();
});
