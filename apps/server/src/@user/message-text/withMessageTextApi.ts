import type { Routes } from "~/hono/Routes";
import { withCreateApi } from "./create";

export const withMessageTextApi: Routes.Fn = (routes) => {
	withCreateApi(routes);
};
