import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { withActivitySelectFx } from "~/user/activity/server/db/withActivitySelectFx";
import type { ActivityFilterSchema } from "~/user/activity/server/schema/ActivityFilterSchema";
import type { ActivityPatchCollectionSchema } from "~/user/activity/server/schema/ActivityPatchCollectionSchema";

export namespace activityPatchCollectionFx {
	export interface Props extends ActivityPatchCollectionSchema.Type {
		scope: ActivityFilterSchema.Type;
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
			const { kysely } = yield* KyselyContextFx;

			let { select, queryFx } = yield* withActivitySelectFx({
				sort: query.sort,
			});

			for (const layer of [
				query.filter,
				query.where,
				scope,
			]) {
				select = yield* queryFx(select, layer);
			}

			const selectIds = select.clearSelect().select("i.id");

			const updated = yield* tryDbFx(async () =>
				kysely
					.updateTable("activity")
					.set(patch)
					.where("id", "in", selectIds)
					.returning("id")
					.execute(),
			);
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
