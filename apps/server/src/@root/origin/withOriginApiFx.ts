import { Effect } from "effect";
import { withOriginEndpointFx } from "~/@root/origin/origin";

export const withOriginApiFx = Effect.fn("withOriginApiFx")(function* () {
	yield* withOriginEndpointFx();
});
