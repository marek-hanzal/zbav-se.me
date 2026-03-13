import { DialectContextFx } from "@use-pico/common/database";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { withBuyerApiFx } from "~/@buyer/withBuyerApiFx";
import { withBuyerHono } from "~/@buyer/withBuyerHono";
import { withPublicApiFx } from "~/@public/withPublicApiFx";
import { withPublicHono } from "~/@public/withPublicHono";
import { withSellerApiFx } from "~/@seller/withSellerApiFx";
import { withSellerHono } from "~/@seller/withSellerHono";
import { withSessionApiFx } from "~/@session/withSessionApiFx";
import { withSessionHono } from "~/@session/withSessionHono";
import { withUserApiFx } from "~/@user/withUserApiFx";
import { withUserHono } from "~/@user/withUserHono";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { database } from "~/database/kysely";
import { withHono } from "~/hono/withHono";
import { initMiddlewareFx } from "~/init/initMiddlewareFx";
import { withMcpApiFx } from "~/mcp/withMcpApiFx";
import { type RoutesContext, RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerDatabaseSchema } from "~/schema/env/ServerDatabaseSchema";

const app = await Effect.gen(function* () {
	const routesContext: RoutesContext = {
		root: withHono(),
		publicHono: withPublicHono(),
		sessionHono: withSessionHono(),
		userHono: withUserHono(),
		sellerHono: withSellerHono(),
		buyerHono: withBuyerHono(),
	};
	const { root } = routesContext;
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
	const kysely = yield* database.pipe(
		Effect.provideService(
			DialectContextFx,
			new PostgresDialect({
				pool: new Pool({
					connectionString: databaseConfig.SERVER_DATABASE_URL,
					max: 3,
				}),
			}),
		),
	);

	yield* initMiddlewareFx().pipe(
		Effect.provideService(KyselyContextFx, kysely),
		Effect.provideService(RoutesContextFx, routesContext),
	);

	yield* Effect.all([
		withPublicApiFx(),
		withSessionApiFx(),
		withUserApiFx(),
		withSellerApiFx(),
		withBuyerApiFx(),
		withMcpApiFx(),
	]).pipe(
		Effect.provideService(KyselyContextFx, kysely),
		Effect.provideService(RoutesContextFx, routesContext),
	);

	return root;
}).pipe(Effect.runPromise);

export default app;
