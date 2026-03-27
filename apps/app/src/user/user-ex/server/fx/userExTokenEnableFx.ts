import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { userExPatchFx } from "~/user/user-ex/server/fx/userExPatchFx";

export namespace userExTokenEnableFx {
	export interface Props {
		userId: string;
	}
}

export const userExTokenEnableFx = Effect.fn("userExTokenEnableFx")(function* ({
	userId,
}: userExTokenEnableFx.Props) {
	return yield* userExPatchFx({
		userId,
		patch: {
			token: genId(),
		},
	});
});

export type userExTokenEnableFx = ReturnType<typeof userExTokenEnableFx>;
