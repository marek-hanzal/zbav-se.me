import type { Routes } from "~/hono/Routes";
import { withAuthEndpoint } from "./auth";

export const withAuthApi: Routes.Fn = (routes) => {
	withAuthEndpoint(routes);
};
