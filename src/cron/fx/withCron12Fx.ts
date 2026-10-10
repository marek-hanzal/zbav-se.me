import { Effect } from "effect";
import { withListingEventCleanupCronFx } from "~/listing/cron/withListingEventCleanupCronFx";
import { withTransactionCleanupCronFx } from "~/transaction/cron/withTransactionCleanupCronFx";
import { withUploadCleanupCronFx } from "~/user-upload/cron/withUploadCleanupCronFx";

export const withCron12Fx = Effect.fn("withCron12Fx")(function* () {
	yield* Effect.all(
		{
			listingEventCleanup: withListingEventCleanupCronFx({
				count: 25_000,
			}),
			transactionCleanup: withTransactionCleanupCronFx({
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

export type withCron12Fx = ReturnType<typeof withCron12Fx>;
