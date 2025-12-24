import type { Routes } from "~/hono/Routes";
import { withDay0Endpoint } from "./day-0";
import { withDay4Endpoint } from "./day-4";
import { withDay8Endpoint } from "./day-8";
import { withDay12Endpoint } from "./day-12";
import { withDay16Endpoint } from "./day-16";
import { withDay20Endpoint } from "./day-20";
import { withHourlyEndpoint } from "./hourly";
import { withMonthlyEndpoint } from "./monthly";

export const withCronApi: Routes.Fn = (routes) => {
	withHourlyEndpoint(routes);
	withMonthlyEndpoint(routes);
    //
	withDay0Endpoint(routes);
	withDay4Endpoint(routes);
	withDay8Endpoint(routes);
	withDay12Endpoint(routes);
	withDay16Endpoint(routes);
	withDay20Endpoint(routes);
};
