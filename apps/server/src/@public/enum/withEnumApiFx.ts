import { Effect } from "effect";
import { withEnumEndpointFx } from "~/@public/enum/enum";

export const withEnumApiFx = Effect.fn("withEnumApiFx")(function* () {
	yield* withEnumEndpointFx();
});
