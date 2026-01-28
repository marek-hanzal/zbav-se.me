import { Effect } from "effect";
import { withDay0EndpointFx } from "~/@public/cron/day-0";
import { withDay4EndpointFx } from "~/@public/cron/day-4";
import { withDay8EndpointFx } from "~/@public/cron/day-8";
import { withDay12EndpointFx } from "~/@public/cron/day-12";
import { withDay16EndpointFx } from "~/@public/cron/day-16";
import { withDay20EndpointFx } from "~/@public/cron/day-20";
import { withHourlyEndpointFx } from "~/@public/cron/hourly";
import { withMonthlyEndpointFx } from "~/@public/cron/monthly";

export const withCronApiFx = Effect.fn("withCronApiFx")(function* () {
	yield* Effect.all([
		withHourlyEndpointFx(),
		withMonthlyEndpointFx(),
		//
		withDay0EndpointFx(),
		withDay4EndpointFx(),
		withDay8EndpointFx(),
		withDay12EndpointFx(),
		withDay16EndpointFx(),
		withDay20EndpointFx(),
	]);
});
