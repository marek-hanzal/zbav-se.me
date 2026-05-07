import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { activityFetchFx } from "~/user/activity/server/fx/activityFetchFx";
import type { ActivityCreateSchema } from "~/user/activity/server/schema/ActivityCreateSchema";

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
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;
			const id = genId();

			yield* tryDbFx(async () => {
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
						timestamp: dateContext.now().toJSDate(),
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
