import { Effect } from "effect";
import { withTransactionCleanupCronFx } from "~/common/transaction/server/cron/withTransactionCleanupCronFx";
import { withUserEventCleanupCronFx } from "~/user/user-event/server/cron/withUserEventCleanupCronFx";

export const withCron00Fx = Effect.fn("withCron00Fx")(function* () {
	yield* Effect.all(
		{
			transactionCleanup: withTransactionCleanupCronFx(),
			userEventCleanup: withUserEventCleanupCronFx(),
		},
		{
			concurrency: 2,
			mode: "either",
		},
	);
});

export type withCron00Fx = ReturnType<typeof withCron00Fx>;
