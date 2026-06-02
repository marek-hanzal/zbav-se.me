import { Effect } from "effect";
import { withCategoryMissCleanupCronFx } from "~/session/category-miss/server/cron/withCategoryMissCleanupCronFx";
import { withUploadCleanupCronFx } from "~/user/upload/server/cron/withUploadCleanupCronFx";
import { withUserEventCleanupCronFx } from "~/user/user-event/server/cron/withUserEventCleanupCronFx";

export const withCron08Fx = Effect.fn("withCron08Fx")(function* () {
	yield* Effect.all(
		{
			categoryMissCleanup: withCategoryMissCleanupCronFx({
				count: 10_000,
			}),
			userEventCleanup: withUserEventCleanupCronFx({
				count: 25_000,
			}),
			uploadCleanup: withUploadCleanupCronFx({
				count: 200,
			}),
		},
		{
			concurrency: 2,
			mode: "either",
		},
	);
});

export type withCron08Fx = ReturnType<typeof withCron08Fx>;
