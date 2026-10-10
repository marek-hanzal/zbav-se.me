import { Effect } from "effect";
import { withListingEventCleanupCronFx } from "~/listing/cron/withListingEventCleanupCronFx";
import { withCategoryMissCleanupCronFx } from "~/session-category-miss/cron/withCategoryMissCleanupCronFx";
import { withUploadCleanupCronFx } from "~/user-upload/cron/withUploadCleanupCronFx";

export const withCron20Fx = Effect.fn("withCron20Fx")(function* () {
	yield* Effect.all(
		{
			categoryMissCleanup: withCategoryMissCleanupCronFx({
				count: 10_000,
			}),
			listingEventCleanup: withListingEventCleanupCronFx({
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

export type withCron20Fx = ReturnType<typeof withCron20Fx>;
