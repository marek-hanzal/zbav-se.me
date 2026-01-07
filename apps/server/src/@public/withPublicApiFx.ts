import { Effect } from "effect";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withCronApiFx } from "./cron/withCronApiFx";
import { withGithubApiFx } from "./github/withGithubApiFx";
import { withHealthApiFx } from "./health/withHealthApiFx";
import { withJanitorApiFx } from "./janitor/withJanitorApiFx";
import { withMigrationApiFx } from "./migration/withMigrationApiFx";
import { withSeedApiFx } from "./seed/seed";

export const withPublicApiFx = Effect.fn("withPublicApiFx")(function* () {
	const { root, publicHono } = yield* RoutesContextFx;
	const database = yield* DatabaseContextFx;

	publicHono.use(async (c, next) => {
		c.set("database", database);
		return next();
	});

	yield* Effect.all([
		withCronApiFx(),
		withGithubApiFx(),
		withHealthApiFx(),
		withJanitorApiFx(),
		withMigrationApiFx(),
		withSeedApiFx(),
	]);

	root.route("/api/public", publicHono);
});
