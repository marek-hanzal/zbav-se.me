import { Effect } from "effect";
import { withUserEventCleanupCronFx } from "~/user/user-event/server/cron/withUserEventCleanupCronFx";

export const withCron08Fx = Effect.fn("withCron08Fx")(function* () {
	yield* Effect.all(
		{
			userEventCleanup: withUserEventCleanupCronFx(),
		},
		{
			concurrency: 2,
			mode: "either",
		},
	);
});

export type withCron08Fx = ReturnType<typeof withCron08Fx>;
