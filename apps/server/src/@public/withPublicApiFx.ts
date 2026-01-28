import { Effect } from "effect";
import { RoutesContextFx } from "~/@common/route/context/RoutesContextFx";
import { withAuthApiFx } from "~/@public/auth/withAuthApiFx";
import { withCorsApiFx } from "~/@public/cors/withCorsApiFx";
import { withOpenApiApiFx } from "~/@public/open-api/withOpenApiApiFx";
import { withOriginApiFx } from "~/@public/origin/withOriginApiFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withCronApiFx } from "./cron/withCronApiFx";
import { withGithubApiFx } from "./github/withGithubApiFx";
import { withHealthApiFx } from "./health/withHealthApiFx";
import { withJanitorApiFx } from "./janitor/withJanitorApiFx";
import { withMigrationApiFx } from "./migration/withMigrationApiFx";
import { withSeedApiFx } from "./seed/seed";

export const withPublicApiFx = Effect.fn("withPublicApiFx")(function* () {
	const { root, publicHono } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	publicHono.use(async (c, next) => {
		c.set("kysely", kysely);
		return next();
	});

	yield* Effect.all([
		withAuthApiFx(),
		withCorsApiFx(),
		withCronApiFx(),
		withGithubApiFx(),
		withHealthApiFx(),
		withJanitorApiFx(),
		withMigrationApiFx(),
		withOpenApiApiFx(),
		withOriginApiFx(),
		withSeedApiFx(),
	]);

	root.route("/api/public", publicHono);
});
