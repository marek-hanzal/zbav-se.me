import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { withActivitySelectFx } from "~/user/activity/server/db/withActivitySelectFx";
import type { ActivityQuerySchema } from "~/user/activity/server/schema/ActivityQuerySchema";
import type { ActivityWhereSchema } from "../schema/ActivityWhereSchema";

export namespace activityArchiveFx {
	export interface Props extends ActivityQuerySchema.Type {
		scope: ActivityWhereSchema.Type;
	}
}

export const activityArchiveFx = Effect.fn("activityArchiveFx")(function* ({
	cursor = {
		page: 0,
		size: 1000,
	},
	where,
	scope,
	sort,
}: activityArchiveFx.Props) {
	const logger = yield* getLoggerFx("activityArchiveFx");
	logger.trace("activityArchiveFx", {
		cursor,
		where,
		scope,
		sort,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const dateContext = yield* DateServiceFx;

			let { select, queryFx } = yield* withActivitySelectFx({
				sort,
			});

			for (const layer of [
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

			yield* dbFx(async (kysely) => {
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
