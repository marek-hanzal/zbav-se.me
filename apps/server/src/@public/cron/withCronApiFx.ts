import { Effect } from "effect";
import { withDay0EndpointFx } from "./day-0";
import { withDay4EndpointFx } from "./day-4";
import { withDay8EndpointFx } from "./day-8";
import { withDay12EndpointFx } from "./day-12";
import { withDay16EndpointFx } from "./day-16";
import { withDay20EndpointFx } from "./day-20";
import { withHourlyEndpointFx } from "./hourly";
import { withMonthlyEndpointFx } from "./monthly";

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
