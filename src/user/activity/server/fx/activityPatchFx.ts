import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { activityFetchFx } from "~/user/activity/server/fx/activityFetchFx";
import type { ActivityPatchSchema } from "~/user/activity/server/schema/ActivityPatchSchema";
import type { ActivityWhereSchema } from "../schema/ActivityWhereSchema";

export namespace activityPatchFx {
	export interface Props extends ActivityPatchSchema.Type {
		scope: ActivityWhereSchema.Type;
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
			const activity = yield* activityFetchFx({
				...query,
				scope,
			});

			yield* dbFx(async (kysely) => {
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
