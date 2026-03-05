import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { keyOf } from "@use-pico/common/key-of";
import { Effect } from "effect";
import type { UserEventEnumSchema } from "~/@common/user-event/schema/UserEventEnumSchema";
import type { UserEventCreateSchema } from "~/@user/user-event/schema/UserEventCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { traceLogFx } from "~/effect/traceLogFx";

const ignored: UserEventEnumSchema.Type[] = [
	"listing.create",
];

export namespace userEventCreateFx {
	export interface Props extends UserEventCreateSchema.Type {
		userId: string;
	}
}

export const userEventCreateFx = Effect.fn("userEventCreateFx")(function* ({
	userId,
	group,
	...data
}: userEventCreateFx.Props) {
	yield* traceLogFx({
		level: "trace",
		message: "userEventCreateFx",
		input: {
			userId,
			group,
			...data,
		},
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			if (ignored.includes(data.event)) {
				return yield* Effect.void;
			}

			return yield* tryDbFx(async () =>
				kysely
					.insertInto("user_event")
					.values({
						...data,
						id: genId(),
						group: keyOf(group),
						userId,
						createdAt: dateContext.now().toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow(),
			);
		}),
	);
});

export type userEventCreateFx = ReturnType<typeof userEventCreateFx>;
