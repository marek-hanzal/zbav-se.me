import { Effect } from "effect";
import { withPatchApiFx } from "./patch";

export const withUserExApiFx = Effect.fn("withUserExApiFx")(function* () {
	yield* withPatchApiFx();
});
