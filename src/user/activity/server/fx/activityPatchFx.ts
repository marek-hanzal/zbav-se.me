import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { activityFetchFx } from "~/user/activity/server/fx/activityFetchFx";
import type { ActivityFilterSchema } from "~/user/activity/server/schema/ActivityFilterSchema";
import type { ActivityPatchSchema } from "~/user/activity/server/schema/ActivityPatchSchema";

export namespace activityPatchFx {
	export interface Props extends ActivityPatchSchema.Type {
		scope: ActivityFilterSchema.Type;
	}
}

export const activityPatchFx = Effect.fn("activityPatchFx")(function* ({
	patch,
	query,
	scope,
}: activityPatchFx.Props) {
	const logger = yield* getLoggerFx("activityPatchFx");
	logger.trace("activityPatchFx", {
		patch,
		query,
		scope,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const activity = yield* activityFetchFx({
				...query,
				scope,
			});

			yield* tryDbFx(async () => {
				return kysely
					.updateTable("activity")
					.set(patch)
					.where("id", "=", activity.id)
					.executeTakeFirst();
			});

			return yield* activityFetchFx({
				where: {
					id: activity.id,
				},
				scope: {
					userId: activity.userId,
				},
			});
		}),
	);
});

export type activityPatchFx = ReturnType<typeof activityPatchFx>;
