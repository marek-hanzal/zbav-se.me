import { Effect } from "effect";
import { withCreateApiFx } from "./create";

export const withListingApiFx = Effect.fn("withListingApiFx")(function* () {
	yield* withCreateApiFx();
});
