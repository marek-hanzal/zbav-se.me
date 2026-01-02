import { genId } from "@use-pico/common/gen-id";
import { keyOf } from "@use-pico/common/key-of";
import { Effect } from "effect";
import { DateTime } from "luxon";
import type { UserEventCreateSchema } from "~/app/user-event/schema/UserEventCreateSchema";
import type { UserEventEnumSchema } from "~/app/user-event/schema/UserEventEnumSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

const ignored: UserEventEnumSchema.Type[] = [
	"listing.create",
];

export namespace userEventCreateFx {
	export interface Props extends UserEventCreateSchema.Type {
		userId?: string;
		createdAt?: DateTime;
	}
}

export const userEventCreateFx = ({
	userId,
	createdAt,
	group,
	...props
}: userEventCreateFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			if (ignored.includes(props.event)) {
				return yield* Effect.void;
			}

			return yield* Effect.tryPromise(async () => {
				return database
					.insertInto("user_event")
					.values({
						id: genId(),
						...props,
						group: keyOf(group),
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
