import { Effect } from "effect";
import { withExpiresAtCronFx } from "~/transaction/cron/withExpiresAtCronFx";
import { withUserEventCleanupCronFx } from "~/user-event/cron/withUserEventCleanupCronFx";
import { withUploadCleanupCronFx } from "~/user-upload/cron/withUploadCleanupCronFx";

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
			mode: "result",
		},
	);
});

export type withCron16Fx = ReturnType<typeof withCron16Fx>;
