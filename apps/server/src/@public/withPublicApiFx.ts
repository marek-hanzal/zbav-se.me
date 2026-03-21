import { Effect } from "effect";
import { withAuthApiFx } from "~/@public/auth/withAuthApiFx";
import { withCorsApiFx } from "~/@public/cors/withCorsApiFx";
import { withCronApiFx } from "~/@public/cron/withCronApiFx";
import { withEnumApiFx } from "~/@public/enum/withEnumApiFx";
import { withGithubApiFx } from "~/@public/github/withGithubApiFx";
import { withHealthApiFx } from "~/@public/health/withHealthApiFx";
import { withJanitorApiFx } from "~/@public/janitor/withJanitorApiFx";
import { withMigrationApiFx } from "~/@public/migration/withMigrationApiFx";
import { withOpenApiApiFx } from "~/@public/open-api/withOpenApiApiFx";
import { withSchemaApiFx } from "~/@public/schema/withSchemaApiFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withPublicApiFx = Effect.fn("withPublicApiFx")(function* () {
	const { root, publicHono } = yield* RoutesContextFx;

	yield* Effect.all([
		withAuthApiFx(),
		withCorsApiFx(),
		withCronApiFx(),
		withEnumApiFx(),
		withSchemaApiFx(),
		withGithubApiFx(),
		withHealthApiFx(),
		withJanitorApiFx(),
		withMigrationApiFx(),
		withOpenApiApiFx(),
	]);

	root.route("/api/public", publicHono);
});
