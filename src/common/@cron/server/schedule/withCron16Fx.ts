import { Effect } from "effect";
import { withExpiresAtCronFx } from "~/common/transaction/server/cron/withExpiresAtCronFx";
import { withUserEventCleanupCronFx } from "~/user/user-event/server/cron/withUserEventCleanupCronFx";

export const withCron16Fx = Effect.fn("withCron16Fx")(function* () {
	yield* Effect.all(
		{
			transactionExpiresAt: withExpiresAtCronFx(),
			userEventCleanup: withUserEventCleanupCronFx(),
		},
		{
			concurrency: 2,
			mode: "either",
		},
	);
});

export type withCron16Fx = ReturnType<typeof withCron16Fx>;
