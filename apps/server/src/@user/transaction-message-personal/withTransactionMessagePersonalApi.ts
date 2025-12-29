import type { Routes } from "~/hono/Routes";
import { withCreateApi } from "./create";

export const withTransactionMessagePersonalApi: Routes.Fn = (routes) => {
	withCreateApi(routes);
};
