import { Effect } from "effect";
import { withTransactionCleanupCronFx } from "~/common/transaction/server/cron/withTransactionCleanupCronFx";

export const withCron12Fx = Effect.fn("withCron12Fx")(function* () {
	yield* Effect.all(
		{
			transactionCleanup: withTransactionCleanupCronFx(),
		},
		{
			concurrency: 2,
			mode: "either",
		},
	);
});

export type withCron12Fx = ReturnType<typeof withCron12Fx>;
