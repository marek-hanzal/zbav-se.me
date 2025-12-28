import type { Routes } from "~/hono/Routes";
import { withCreateApi } from "./create";

export const withTransactionMessageDateApi: Routes.Fn = (routes) => {
	withCreateApi(routes);
};
