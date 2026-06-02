import { Effect } from "effect";
import { withListingEventCleanupCronFx } from "~/common/listing/server/cron/withListingEventCleanupCronFx";
import { withCategoryMissCleanupCronFx } from "~/session/category-miss/server/cron/withCategoryMissCleanupCronFx";
import { withUploadCleanupCronFx } from "~/user/upload/server/cron/withUploadCleanupCronFx";

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
			mode: "either",
		},
	);
});

export type withCron20Fx = ReturnType<typeof withCron20Fx>;
