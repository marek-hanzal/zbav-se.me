import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { keyOfFn } from "~/hash/fn/keyOfFn";
import { genIdFn } from "~/identity/fn/genIdFn";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import type { UserEventCreateSchema } from "~/user-event/schema/UserEventCreateSchema";

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
			const dateService = yield* DateServiceFx;

			return yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("user_event")
					.values({
						...data,
						id: genIdFn(),
						group: keyOfFn(group),
						userId,
						createdAt: dateService.nowFn().toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});
		}),
	);
});

export type userEventCreateFx = ReturnType<typeof userEventCreateFx>;
