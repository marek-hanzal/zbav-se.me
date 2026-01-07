import { Effect } from "effect";
import { withHealthEndpointFx } from "./health";

export const withHealthApiFx = Effect.fn("withHealthApiFx")(function* () {
	yield* withHealthEndpointFx();
});
