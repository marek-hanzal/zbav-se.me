import { DialectContextLayer } from "@use-pico/common/database";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { RoutesContextLayer } from "~/app/routes/RoutesContextLayer";
import { KyselyContextLayerFx } from "~/database/context/KyselyContextLayerFx";
import { initMiddlewareFx } from "~/init/initMiddlewareFx";
import { ServerDatabaseSchema } from "~/schema/env/ServerDatabaseSchema";
import { withPublicApiFx } from "./@public/withPublicApiFx";
import { withRootApi } from "./@root/withRootApi";
import { withSessionApiFx } from "./@session/withSessionApiFx";
import { withUserApiFx } from "./@user/withUserApiFx";
import { RoutesContextFx } from "./app/routes/RoutesContextFx";
import { database } from "./database/kysely";
import { withHono } from "./hono/withHono";
import { withSessionHono } from "./hono/withSessionHono";
import { withUserHono } from "./hono/withUserHono";
import type { NoticeSchema } from "./schema/NoticeSchema";

const app = await Effect.gen(function* () {
	const { root } = yield* RoutesContextFx;

	root.onError((err, c) => {
		return c.json<NoticeSchema.Type, 500>(
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

	yield* initMiddlewareFx();

	const databaseConfig = ServerDatabaseSchema.parse(process.env);

	yield* Effect.all([
		withRootApi(),
		withPublicApiFx(),
		withSessionApiFx(),
		withUserApiFx(),
	]).pipe(
		Effect.provide(
			KyselyContextLayerFx(
				database.pipe(
					Effect.provide(
						DialectContextLayer(
							new PostgresDialect({
								pool: new Pool({
									connectionString: databaseConfig.SERVER_DATABASE_URL,
									max: 3,
								}),
							}),
						),
					),
				),
			),
		),
	);

	return root;
}).pipe(
	Effect.provide(
		RoutesContextLayer({
			root: withHono(),
			publicHono: withHono(),
			sessionHono: withSessionHono(),
			userHono: withUserHono(),
		}),
	),
	Effect.runPromise,
);

export default app;
