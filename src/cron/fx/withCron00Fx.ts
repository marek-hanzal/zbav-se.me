import { Effect } from "effect";
import { withTransactionCleanupCronFx } from "~/transaction/cron/withTransactionCleanupCronFx";

export const withCron00Fx = Effect.fn("withCron00Fx")(function* () {
	yield* Effect.all(
		{
			transactionCleanup: withTransactionCleanupCronFx({
				count: 25_000,
			}),
		},
		{
			concurrency: 2,
			mode: "result",
		},
	);
});

export type withCron00Fx = ReturnType<typeof withCron00Fx>;
