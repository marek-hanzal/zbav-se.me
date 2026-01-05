import type { Routes } from "~/hono/Routes";
import { withJanitorCleanupApi } from "./janitor-cleanup";

export const withJanitorApi: Routes.Fn = async (routes) => {
	await withJanitorCleanupApi(routes);
};
