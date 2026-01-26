import { DialectContextLayer } from "@use-pico/common/database";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { withPublicHono } from "~/@public/withPublicHono";
import { KyselyContextLayerFx } from "~/database/context/KyselyContextLayerFx";
import { initMiddlewareFx } from "~/init/initMiddlewareFx";
import { RoutesContextLayer } from "~/routes/context/RoutesContextLayer";
import { ServerDatabaseSchema } from "~/schema/env/ServerDatabaseSchema";
import { withBuyerApiFx } from "./@buyer/withBuyerApiFx";
import { withBuyerHono } from "./@buyer/withBuyerHono";
import { withPublicApiFx } from "./@public/withPublicApiFx";
import { withSellerApiFx } from "./@seller/withSellerApiFx";
import { withSellerHono } from "./@seller/withSellerHono";
import { withSessionApiFx } from "./@session/withSessionApiFx";
import { withSessionHono } from "./@session/withSessionHono";
import { withUserApiFx } from "./@user/withUserApiFx";
import { withUserHono } from "./@user/withUserHono";
import { database } from "./database/kysely";
import { withHono } from "./hono/withHono";
import { RoutesContextFx } from "./routes/RoutesContextFx";
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

	const databaseConfig = ServerDatabaseSchema.parse(process.env);
	const kyselyContext = KyselyContextLayerFx(
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
	);

	yield* initMiddlewareFx().pipe(Effect.provide(kyselyContext));

	yield* Effect.all([
		withPublicApiFx(),
		withSessionApiFx(),
		withUserApiFx(),
		withSellerApiFx(),
		withBuyerApiFx(),
	]).pipe(Effect.provide(kyselyContext));

	return root;
}).pipe(
	Effect.provide(
		RoutesContextLayer({
			root: withHono(),
			publicHono: withPublicHono(),
			sessionHono: withSessionHono(),
			userHono: withUserHono(),
			sellerHono: withSellerHono(),
			buyerHono: withBuyerHono(),
		}),
	),
	Effect.runPromise,
);

export default app;
