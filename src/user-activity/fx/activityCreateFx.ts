import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { activityFetchFx } from "~/user-activity/fx/activityFetchFx";
import type { ActivityCreateSchema } from "~/user-activity/schema/ActivityCreate";

export namespace activityCreateFx {
	export type Props = ActivityCreateSchema.Type;
}

export const activityCreateFx = Effect.fn("activityCreateFx")(function* ({
	userId,
	reference,
	family,
	type,
	payload,
	priority,
}: activityCreateFx.Props) {
	const logger = yield* getLoggerFx("activityCreateFx");
	logger.trace("activityCreateFx", {
		userId,
		reference,
		family,
		type,
		payload,
		priority,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const dateService = yield* DateServiceFx;
			const id = genIdFn();

			yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("activity")
					.values({
						id,
						userId,
						reference: reference ?? [],
						family,
						type,
						payload,
						priority,
						timestamp: dateService.nowFn().toJSDate(),
						archivedAt: null,
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* activityFetchFx({
				where: {
					id,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type activityCreateFx = ReturnType<typeof activityCreateFx>;
