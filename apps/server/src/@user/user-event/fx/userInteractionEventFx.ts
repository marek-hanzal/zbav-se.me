import { Effect } from "effect";
import type { DateTime } from "luxon";
import type { UserEventCreateSchema } from "~/app/user-event/schema/UserEventCreateSchema";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { userEventCreateFx } from "./userEventCreateFx";

export namespace userInteractionEventFx {
	export interface Props extends Omit<UserEventCreateSchema.Type, "scope"> {
		userId: string;
		targetId: string;
		createdAt?: DateTime;
	}
}

export const userInteractionEventFx = Effect.fn("userInteractionEventFx")(function* ({
	userId,
	targetId,
	createdAt,
	...props
}: userInteractionEventFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			yield* userEventCreateFx({
				userId,
				scope: "user",
				createdAt,
				...props,
			});

			yield* userEventCreateFx({
				userId: targetId,
				scope: "foreign",
				createdAt,
				...props,
			});
		}),
	);
});

export type userInteractionEventFx = ReturnType<typeof userInteractionEventFx>;
