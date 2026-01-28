import { Effect } from "effect";
import { withPatchApiFx } from "~/@user/user-ex/patch";

export const withUserExApiFx = Effect.fn("withUserExApiFx")(function* () {
	yield* withPatchApiFx();
});
