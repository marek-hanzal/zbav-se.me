import { withDialectFx } from "@use-pico/common/database";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { withPublicApiFx } from "~/@public/withPublicApiFx";
import { withPublicHono } from "~/@public/withPublicHono";
import { withSellerApiFx } from "~/@seller/withSellerApiFx";
import { withSellerHono } from "~/@seller/withSellerHono";
import { withSessionHono } from "~/@session/withSessionHono";
import { withUserApiFx } from "~/@user/withUserApiFx";
import { withUserHono } from "~/@user/withUserHono";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { database } from "~/database/kysely";
import { withHono } from "~/hono/withHono";
import { initMiddlewareFx } from "~/init/initMiddlewareFx";
import { withMcpApiFx } from "~/mcp/withMcpApiFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerDatabaseSchema } from "~/schema/env/ServerDatabaseSchema";

const app = await Effect.gen(function* () {
	const { root } = yield* RoutesContextFx;

	root.onError((err, c) => {
		return c.json(
			{
				type: "error",
				message: err instanceof Error ? err.message : "Internal server error",
			},
			500,
			{
				"X-Error-Type": "Fallback Server Error",
			},
		);
	});

	const databaseConfig = ServerDatabaseSchema.parse(process.env);
	const kyselyContext = yield* database.pipe(
		withDialectFx(
			new PostgresDialect({
				pool: new Pool({
					connectionString: databaseConfig.SERVER_DATABASE_URL,
					max: 3,
				}),
			}),
		),
	);

	yield* initMiddlewareFx().pipe(withKyselyFx(kyselyContext));

	yield* Effect.all([
		withPublicApiFx(),
		withUserApiFx(),
		withSellerApiFx(),
		withMcpApiFx(),
	]).pipe(withKyselyFx(kyselyContext));

	return root;
}).pipe(
	Effect.provideService(RoutesContextFx, {
		root: withHono(),
		publicHono: withPublicHono(),
		sessionHono: withSessionHono(),
		userHono: withUserHono(),
		sellerHono: withSellerHono(),
	}),
	Effect.runPromise,
);

export default app;
