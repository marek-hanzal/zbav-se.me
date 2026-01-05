import type { WithDatabase } from "../database/WithDatabase";
import type { Routes } from "../hono/Routes";
import { withCronApi } from "./cron/withCronApi";
import { withGithubApi } from "./github/withGithubApi";
import { withHealthApi } from "./health/withHealthApi";
import { withJanitorApi } from "./janitor/withJanitorApi";
import { withMigrationApi } from "./migration/withMigrationApi";
import { withSeedApi } from "./seed/seed";

export const withPublicApi: Routes.FnWithDeps<{
	database: WithDatabase;
}> = async (routes, deps) => {
	routes.publicHono.use(async (c, next) => {
		c.set("database", deps.database);
		return next();
	});

	await withCronApi(routes);
	await withGithubApi(routes);
	await withHealthApi(routes);
	await withJanitorApi(routes);
	await withMigrationApi(routes);
	await withSeedApi(routes);

	routes.root.route("/api/public", routes.publicHono);
};
