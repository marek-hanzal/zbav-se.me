import type { Routes } from "../hono/Routes";
import { withJanitorCleanupApi } from "./endpoint/janitor-cleanup";

export const withJanitorApi: Routes.Fn = (routes) => {
	withJanitorCleanupApi(routes);
};
