import { Effect } from "effect";
import { withHealthEndpointFx } from "~/@public/health/health";

export const withHealthApiFx = Effect.fn("withHealthApiFx")(function* () {
	yield* withHealthEndpointFx();
});
