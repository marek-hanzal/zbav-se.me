import type { WithDatabase } from "../database/WithDatabase";
import type { Routes } from "../hono/Routes";
import { withHealthApi } from "./health/withHealthApi";
import { withJanitorApi } from "./janitor/withJanitorApi";
import { withMigrationApi } from "./migration/withMigrationApi";

export const withPublicApi: Routes.FnWithDeps<{
	database: WithDatabase;
}> = (routes, deps) => {
	routes.publicHono.use(async (c, next) => {
		c.set("database", deps.database);
		return next();
	});

	withHealthApi(routes);
	withJanitorApi(routes);
	withMigrationApi(routes);

	routes.root.route("/api/public", routes.publicHono);
};
