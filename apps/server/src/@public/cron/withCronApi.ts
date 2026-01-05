import type { Routes } from "~/hono/Routes";
import { withDay0Endpoint } from "./day-0";
import { withDay4Endpoint } from "./day-4";
import { withDay8Endpoint } from "./day-8";
import { withDay12Endpoint } from "./day-12";
import { withDay16Endpoint } from "./day-16";
import { withDay20Endpoint } from "./day-20";
import { withHourlyEndpoint } from "./hourly";
import { withMonthlyEndpoint } from "./monthly";

export const withCronApi: Routes.Fn = async (routes) => {
	await withHourlyEndpoint(routes);
	await withMonthlyEndpoint(routes);
	//
	await withDay0Endpoint(routes);
	await withDay4Endpoint(routes);
	await withDay8Endpoint(routes);
	await withDay12Endpoint(routes);
	await withDay16Endpoint(routes);
	await withDay20Endpoint(routes);
};
