import { Effect } from "effect";
import { withExpiresAtCronFx } from "~/common/transaction/server/cron/withExpiresAtCronFx";

export const withCron04Fx = Effect.fn("withCron04Fx")(function* () {
	yield* Effect.all(
		{
			transactionExpiresAt: withExpiresAtCronFx(),
		},
		{
			concurrency: 2,
			mode: "either",
		},
	);
});

export type withCron04Fx = ReturnType<typeof withCron04Fx>;
