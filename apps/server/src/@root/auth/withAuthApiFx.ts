import { Effect } from "effect";
import { withAuthEndpointFx } from "./auth";

export const withAuthApiFx = Effect.fn("withAuthApiFx")(function* () {
	yield* withAuthEndpointFx();
});
