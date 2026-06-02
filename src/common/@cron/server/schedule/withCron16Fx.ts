import { Effect } from "effect";
import { withExpiresAtCronFx } from "~/common/transaction/server/cron/withExpiresAtCronFx";
import { withUploadCleanupCronFx } from "~/user/upload/server/cron/withUploadCleanupCronFx";
import { withUserEventCleanupCronFx } from "~/user/user-event/server/cron/withUserEventCleanupCronFx";

export const withCron16Fx = Effect.fn("withCron16Fx")(function* () {
	yield* Effect.all(
		{
			transactionExpiresAt: withExpiresAtCronFx(),
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

export type withCron16Fx = ReturnType<typeof withCron16Fx>;
