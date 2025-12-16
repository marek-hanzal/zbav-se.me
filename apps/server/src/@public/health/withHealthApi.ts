import type { Routes } from "~/hono/Routes";
import { withHealthEndpoint } from "./health";

export const withHealthApi: Routes.Fn = (routes) => {
	withHealthEndpoint(routes);
};
