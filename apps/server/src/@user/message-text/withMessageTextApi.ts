import type { Routes } from "~/hono/Routes";
import { withMessageTextCreateApi } from "./create";

export const withMessageTextApi: Routes.Fn = (routes) => {
	withMessageTextCreateApi(routes);
};
