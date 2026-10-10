import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withActivitySelectFx } from "~/user-activity/db/withActivitySelectFx";
import type { ActivityPatchCollectionSchema } from "~/user-activity/schema/ActivityPatchCollectionSchema";
import type { ActivityWhereSchema } from "~/user-activity/schema/ActivityWhereSchema";

export namespace activityPatchCollectionFx {
	export interface Props extends ActivityPatchCollectionSchema.Type {
		scope: ActivityWhereSchema.Type;
	}
}

export const activityPatchCollectionFx = Effect.fn("activityPatchCollectionFx")(function* ({
	patch,
	query,
	scope,
}: activityPatchCollectionFx.Props) {
	const logger = yield* getLoggerFx("activityPatchCollectionFx");
	logger.trace("activityPatchCollectionFx", {
		patch,
		query,
		scope,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			let { select, queryFx } = yield* withActivitySelectFx({
				sort: query.sort,
			});

			for (const layer of [
				query.where,
				scope,
			]) {
				select = yield* queryFx(select, layer);
			}

			const selectIds = select.clearSelect().select("i.id");

			const updated = yield* dbFx(async (kysely) => {
				return kysely
					.updateTable("activity")
					.set(patch)
					.where("id", "in", selectIds)
					.returning("id")
					.execute();
			});
			const ids = updated.map(({ id }) => id);

			if (ids.length === 0) {
				return [];
			}

			return yield* withCollectionFx({
				selectFx: withActivitySelectFx({
					sort: query.sort,
				}),
				cursor: {
					page: 0,
					size: ids.length,
				},
				where: {
					idIn: ids,
				},
				scope,
			});
		}),
	);
});

export type activityPatchCollectionFx = ReturnType<typeof activityPatchCollectionFx>;
