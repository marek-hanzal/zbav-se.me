import { genId } from "@use-pico/common/gen-id";
import { keyOf } from "@use-pico/common/key-of";
import { Effect } from "effect";
import { DateTime } from "luxon";
import type { UserEventCreateSchema } from "~/app/user-event/schema/UserEventCreateSchema";
import type { UserEventEnumSchema } from "~/app/user-event/schema/UserEventEnumSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

const ignored: UserEventEnumSchema.Type[] = [
	"listing.create",
];

export namespace userEventCreateFx {
	export interface Props extends UserEventCreateSchema.Type {
		userId: string;
		createdAt?: DateTime;
	}
}

export const userEventCreateFx = Effect.fn("userEventCreateFx")(function* ({
	userId,
	createdAt,
	group,
	...data
}: userEventCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			if (ignored.includes(data.event)) {
				return yield* Effect.void;
			}

			return yield* Effect.promise(async () => {
				return kysely
					.insertInto("user_event")
					.values({
						...data,
						id: genId(),
						group: keyOf(group),
						userId,
						createdAt: (createdAt ?? DateTime.now()).toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});
		}),
	);
});

export type userEventCreateFx = ReturnType<typeof userEventCreateFx>;
