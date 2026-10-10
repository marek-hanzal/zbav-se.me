import { Effect } from "effect";
import { withCategoryMissCleanupCronFx } from "~/session-category-miss/cron/withCategoryMissCleanupCronFx";
import { withUserEventCleanupCronFx } from "~/user-event/cron/withUserEventCleanupCronFx";
import { withUploadCleanupCronFx } from "~/user-upload/cron/withUploadCleanupCronFx";

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
			mode: "result",
		},
	);
});

export type withCron08Fx = ReturnType<typeof withCron08Fx>;
