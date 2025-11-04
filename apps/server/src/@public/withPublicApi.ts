import type { Routes } from "../hono/Routes";
import { withHealthApi } from "./health/withHealthApi";
import { withJanitorApi } from "./janitor/withJanitorApi";
import { withMigrationApi } from "./migration/withMigrationApi";

export const withPublicApi: Routes.Fn = (routes) => {
	withHealthApi(routes);
	withJanitorApi(routes);
	withMigrationApi(routes);

	routes.root.route("/api/public", routes.publicHono);
};
