import { Effect } from "effect";
import { withOpenApiEndpointFx } from "~/@public/open-api/open-api";

export const withOpenApiApiFx = Effect.fn("withOpenApiApiFx")(function* () {
	yield* withOpenApiEndpointFx();
});
