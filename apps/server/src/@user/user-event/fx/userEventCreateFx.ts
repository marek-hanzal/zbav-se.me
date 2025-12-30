import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import type { UserEventCreateSchema } from "~/@user/user-event/schema/UserEventCreateSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace userEventCreateFx {
	export interface Props extends UserEventCreateSchema.Type {
		userId?: string;
		createdAt?: DateTime;
	}
}

export const userEventCreateFx = ({ userId, createdAt, ...props }: userEventCreateFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			return yield* Effect.tryPromise(async () => {
				return database
					.insertInto("user_event")
					.values({
						id: genId(),
						...props,
						userId: userId ?? user.id,
						createdAt: (createdAt ?? DateTime.now()).toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});
		}),
	);
};

export type userEventCreateFx = ReturnType<typeof userEventCreateFx>;
