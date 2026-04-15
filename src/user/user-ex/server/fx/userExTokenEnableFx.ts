import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { userExPatchFx } from "~/user/user-ex/server/fx/userExPatchFx";

export namespace userExTokenEnableFx {
	export interface Props {
		userId: string;
	}
}

export const userExTokenEnableFx = Effect.fn("userExTokenEnableFx")(function* ({
	userId,
}: userExTokenEnableFx.Props) {
	const logger = yield* getLoggerFx("userExTokenEnableFx");
	logger.trace("userExTokenEnableFx", {
		userId,
	});

	return yield* userExPatchFx({
		userId,
		patch: {
			token: genId(),
		},
	});
});

export type userExTokenEnableFx = ReturnType<typeof userExTokenEnableFx>;
