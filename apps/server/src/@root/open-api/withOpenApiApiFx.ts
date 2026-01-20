import { Effect } from "effect";
import { withOpenApiEndpointFx } from "~/@root/open-api/open-api";

export const withOpenApiApiFx = Effect.fn("withOpenApiApiFx")(function* () {
	yield* withOpenApiEndpointFx();
});
