import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { keyOf } from "@/lib/common/key-of";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { UserEventCreateSchema } from "../schema/UserEventCreateSchema";

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
	const logger = yield* getLoggerFx("userEventCreateFx");
	logger.trace("userEventCreateFx", {
		userId,
		group,
		...data,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

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
