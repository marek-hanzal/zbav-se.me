import { Effect } from "effect";
import { withExpireAtCronFx } from "~/common/listing/server/cron/withExpireAtCronFx";

export const withCronHourlyFx = Effect.fn("withCronHourlyFx")(function* () {
	yield* withExpireAtCronFx();
});

export type withCronHourlyFx = ReturnType<typeof withCronHourlyFx>;
