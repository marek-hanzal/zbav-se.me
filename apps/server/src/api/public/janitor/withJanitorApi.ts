import type { Routes } from "../../../hono/Routes";
import { withJanitorCleanupApi } from "./janitor-cleanup";

export const withJanitorApi: Routes.Fn = (routes) => {
	withJanitorCleanupApi(routes);
};
