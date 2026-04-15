import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { UserEventCreateSchema } from "../schema/UserEventCreateSchema";
import { userEventCreateFx } from "./userEventCreateFx";

export namespace userInteractionEventFx {
	export interface Props extends Omit<UserEventCreateSchema.Type, "scope"> {
		userId: string;
		targetId: string;
	}
}

export const userInteractionEventFx = Effect.fn("userInteractionEventFx")(function* ({
	userId,
	targetId,
	...props
}: userInteractionEventFx.Props) {
	const logger = yield* getLoggerFx("userInteractionEventFx");
	logger.trace("userInteractionEventFx", {
		userId,
		targetId,
		...props,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			yield* userEventCreateFx({
				userId,
				scope: "user",
				...props,
			});

			yield* userEventCreateFx({
				userId: targetId,
				scope: "foreign",
				...props,
			});
		}),
	);
});

export type userInteractionEventFx = ReturnType<typeof userInteractionEventFx>;
