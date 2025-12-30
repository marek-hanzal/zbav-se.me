import type { Routes } from "~/hono/Routes";
import { withSourceApi } from "./source";

export const withUserEventApi: Routes.Fn = (routes) => {
	withSourceApi(routes);
};
