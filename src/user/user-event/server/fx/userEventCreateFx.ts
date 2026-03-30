import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { keyOf } from "@/lib/common/key-of";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { UserEventCreateSchema } from "../schema/UserEventCreateSchema";
import type { UserEventEnumSchema } from "../schema/UserEventEnumSchema";

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
