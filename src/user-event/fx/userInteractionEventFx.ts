import { Effect } from "effect";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { userEventCreateFx } from "~/user-event/fx/userEventCreateFx";
import type { UserEventCreateSchema } from "~/user-event/schema/UserEventCreateSchema";

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
