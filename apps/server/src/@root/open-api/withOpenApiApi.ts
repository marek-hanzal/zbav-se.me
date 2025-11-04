import type { Routes } from "../../hono/Routes";
import { withOpenApiEndpoint } from "./open-api";

export const withOpenApiApi: Routes.Fn = (routes) => {
	withOpenApiEndpoint(routes);
};
