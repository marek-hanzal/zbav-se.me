import { Effect } from "effect";
import { withExpireAtCronFx } from "~/listing/cron/withExpireAtCronFx";

export const withCronHourlyFx = Effect.fn("withCronHourlyFx")(function* () {
	yield* Effect.all(
		{
			expireAt: withExpireAtCronFx(),
		},
		{
			concurrency: 2,
			mode: "result",
		},
	);
});

export type withCronHourlyFx = ReturnType<typeof withCronHourlyFx>;
