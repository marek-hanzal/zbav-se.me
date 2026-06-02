import { Effect } from "effect";
import { withListingEventCleanupCronFx } from "~/common/listing/server/cron/withListingEventCleanupCronFx";
import { withTransactionCleanupCronFx } from "~/common/transaction/server/cron/withTransactionCleanupCronFx";
import { withUploadCleanupCronFx } from "~/user/upload/server/cron/withUploadCleanupCronFx";

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
			mode: "either",
		},
	);
});

export type withCron12Fx = ReturnType<typeof withCron12Fx>;
