import type { Routes } from "~/hono/Routes";
import { withOpenApiEndpoint } from "./open-api";

export const withOpenApiApi: Routes.Fn = async (routes) => {
	await withOpenApiEndpoint(routes);
};
