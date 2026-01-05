import type { Routes } from "~/hono/Routes";
import { withCreateApi } from "./create";

export const withListingEventApi: Routes.Fn = async (routes) => {
	await withCreateApi(routes);
};
