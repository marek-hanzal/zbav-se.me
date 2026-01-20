import { Effect } from "effect";
import { withCreateApiFx } from "./create";

export const withListingEventApiFx = Effect.fn("withListingEventApiFx")(function* () {
	yield* withCreateApiFx();
});
