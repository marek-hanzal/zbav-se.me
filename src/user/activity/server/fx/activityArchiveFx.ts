import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { withActivitySelectFx } from "~/user/activity/server/db/withActivitySelectFx";
import type { ActivityFilterSchema } from "~/user/activity/server/schema/ActivityFilterSchema";
import type { ActivityQuerySchema } from "~/user/activity/server/schema/ActivityQuerySchema";

export namespace activityArchiveFx {
	export interface Props extends ActivityQuerySchema.Type {
		scope: ActivityFilterSchema.Type;
	}
}

export const activityArchiveFx = Effect.fn("activityArchiveFx")(function* ({
	cursor = {
		page: 0,
		size: 1000,
	},
	filter,
	where,
	scope,
	sort,
}: activityArchiveFx.Props) {
	const logger = yield* getLoggerFx("activityArchiveFx");
	logger.trace("activityArchiveFx", {
		cursor,
		filter,
		where,
		scope,
		sort,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			let { select, queryFx } = yield* withActivitySelectFx({
				sort,
			});

			for (const layer of [
				filter,
				where,
				scope,
			]) {
				select = yield* queryFx(select, layer);
			}

			const archivedAt = dateContext.now().toJSDate();
			const selectIds = select
				.clearSelect()
				.select("i.id")
				.limit(cursor.size)
				.offset(cursor.page * cursor.size);

			yield* tryDbFx(async () => {
				return kysely
					.updateTable("activity")
					.set({
						archivedAt,
					})
					.where("activity.id", "in", selectIds)
					.execute();
			});
		}),
	);
});

export type activityArchiveFx = ReturnType<typeof activityArchiveFx>;
