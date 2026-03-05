import { Effect } from "effect";
import { withPatchApiFx } from "~/@user/user-ex/patch";
import { withTokenDisableApiFx } from "~/@user/user-ex/token-disable";
import { withTokenEnableApiFx } from "~/@user/user-ex/token-enable";

export const withUserExApiFx = Effect.fn("withUserExApiFx")(function* () {
	yield* withPatchApiFx();
	yield* withTokenEnableApiFx();
	yield* withTokenDisableApiFx();
});
