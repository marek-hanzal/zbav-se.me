import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { userExPatchFx } from "~/user/user-ex/server/fx/userExPatchFx";

export namespace userExTokenDisableFx {
	export interface Props {
		userId: string;
	}
}

export const userExTokenDisableFx = Effect.fn("userExTokenDisableFx")(function* ({
	userId,
}: userExTokenDisableFx.Props) {
	const logger = yield* getLoggerFx("userExTokenDisableFx");
	logger.debug("userExTokenDisableFx", {
		userId,
	});

	return yield* userExPatchFx({
		userId,
		patch: {
			token: null,
		},
	});
});

export type userExTokenDisableFx = ReturnType<typeof userExTokenDisableFx>;
