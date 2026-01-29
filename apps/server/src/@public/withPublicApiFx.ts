import { Effect } from "effect";
import { withAuthApiFx } from "~/@public/auth/withAuthApiFx";
import { withCorsApiFx } from "~/@public/cors/withCorsApiFx";
import { withCronApiFx } from "~/@public/cron/withCronApiFx";
import { withGithubApiFx } from "~/@public/github/withGithubApiFx";
import { withHealthApiFx } from "~/@public/health/withHealthApiFx";
import { withJanitorApiFx } from "~/@public/janitor/withJanitorApiFx";
import { withMigrationApiFx } from "~/@public/migration/withMigrationApiFx";
import { withOpenApiApiFx } from "~/@public/open-api/withOpenApiApiFx";
import { withOriginApiFx } from "~/@public/origin/withOriginApiFx";
import { withSeedApiFx } from "~/@public/seed/seed";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

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
