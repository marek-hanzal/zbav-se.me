import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { withActivityQueryBuilderFx } from "~/user/activity/server/db/withActivityQueryBuilderFx";
import { withActivitySelectFx } from "~/user/activity/server/db/withActivitySelectFx";
import type { ActivityFilterSchema } from "~/user/activity/server/schema/ActivityFilterSchema";
import type { ActivityQuerySchema } from "~/user/activity/server/schema/ActivityQuerySchema";

export namespace activityArchiveFx {
	export interface Props extends ActivityQuerySchema.Type {
		scope: ActivityFilterSchema.Type;
	}
}

export const activityArchiveFx = Effect.fn("activityArchiveFx")(function* ({
	cursor,
	filter,
	where,
	scope,
	sort,
}: activityArchiveFx.Props) {
	const logger = yield* getLoggerFx("activityArchiveFx");
	logger.debug("activityArchiveFx", {
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
			const cursorValue = cursor ?? {
				page: 0,
				size: 1000,
			};

			let select = yield* withActivitySelectFx({
				sort,
			});

			for (const layer of [
				filter,
				where,
				scope,
			]) {
				select = yield* withActivityQueryBuilderFx({
					select,
					where: layer,
				});
			}

			const archivedAt = dateContext.now().toJSDate();
			const selectIds = select
				.clearSelect()
				.select("i.id")
				.limit(cursorValue.size)
				.offset(cursorValue.page * cursorValue.size);

			yield* tryDbFx(async () =>
				kysely
					.updateTable("activity")
					.set({
						archivedAt,
					})
					.where("activity.id", "in", selectIds)
					.execute(),
			);
		}),
	);
});

export type activityArchiveFx = ReturnType<typeof activityArchiveFx>;
