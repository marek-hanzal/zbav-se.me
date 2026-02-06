import { Effect } from "effect";
import { withSchemaEndpointFx } from "~/@public/schema/schema";

export const withSchemaApiFx = Effect.fn("withSchemaApiFx")(function* () {
	yield* withSchemaEndpointFx();
});
