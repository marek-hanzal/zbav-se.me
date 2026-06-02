import { Effect } from "effect";
import { withTransactionCleanupCronFx } from "~/common/transaction/server/cron/withTransactionCleanupCronFx";

export const withCron00Fx = Effect.fn("withCron00Fx")(function* () {
	yield* Effect.all(
		{
			transactionCleanup: withTransactionCleanupCronFx({
				count: 25_000,
			}),
		},
		{
			concurrency: 2,
			mode: "either",
		},
	);
});

export type withCron00Fx = ReturnType<typeof withCron00Fx>;
