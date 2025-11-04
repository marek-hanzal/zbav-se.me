import type { Routes } from "../hono/Routes";
import { withMigrationRunApi } from "./endpoint/migration-run";

export const withMigrationApi: Routes.Fn = (routes) => {
	withMigrationRunApi(routes);
};
