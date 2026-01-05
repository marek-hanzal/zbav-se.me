import type { Routes } from "~/hono/Routes";
import { withMigrationRunApi } from "./migration-run";

export const withMigrationApi: Routes.Fn = async (routes) => {
	await withMigrationRunApi(routes);
};
