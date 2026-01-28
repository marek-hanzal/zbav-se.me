import { Effect } from "effect";
import { userEventCreateFx } from "~/@user/user-event/fx/userEventCreateFx";
import type { UserEventCreateSchema } from "~/@user/user-event/schema/UserEventCreateSchema";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

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
