import { Effect } from "effect";
import { withOriginEndpointFx } from "~/@public/origin/origin";

export const withOriginApiFx = Effect.fn("withOriginApiFx")(function* () {
	yield* withOriginEndpointFx();
});
