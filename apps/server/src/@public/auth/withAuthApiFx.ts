import { Effect } from "effect";
import { withAuthEndpointFx } from "~/@public/auth/auth";

export const withAuthApiFx = Effect.fn("withAuthApiFx")(function* () {
	yield* withAuthEndpointFx();
});
