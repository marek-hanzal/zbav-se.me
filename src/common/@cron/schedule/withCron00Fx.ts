import { Effect } from "effect";
import { withExpireAtCronFx } from "~/common/listing/cron/withExpireAtCronFx";

export const withCron00Fx = Effect.fn("withCron00Fx")(function* () {
	yield* withExpireAtCronFx();
});

export type withCron00Fx = ReturnType<typeof withCron00Fx>;
