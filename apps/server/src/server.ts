import { DialectContextLayer } from "@use-pico/common/database";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { RoutesContextFx } from "~/@common/route/context/RoutesContextFx";
import { RoutesContextLayer } from "~/@common/route/context/RoutesContextLayer";
import { withPublicHono } from "~/@public/withPublicHono";
import { KyselyContextLayerFx } from "~/database/context/KyselyContextLayerFx";
import { initMiddlewareFx } from "~/init/initMiddlewareFx";
import { ServerDatabaseSchema } from "~/schema/env/ServerDatabaseSchema";
import { withBuyerSessionApiFx } from "./@buyer-session/withBuyerSessionApiFx";
import { withBuyerSessionHono } from "./@buyer-session/withBuyerSessionHono";
import { withBuyerUserApiFx } from "./@buyer-user/withBuyerUserApiFx";
import { withBuyerUserHono } from "./@buyer-user/withBuyerUserHono";
import { withPublicApiFx } from "./@public/withPublicApiFx";
import { withSellerSessionApiFx } from "./@seller-session/withSellerSessionApiFx";
import { withSellerSessionHono } from "./@seller-session/withSellerSessionHono";
import { withSellerUserApiFx } from "./@seller-user/withSellerUserApiFx";
import { withSellerUserHono } from "./@seller-user/withSellerUserHono";
import { withSessionApiFx } from "./@session/withSessionApiFx";
import { withSessionHono } from "./@session/withSessionHono";
import { withUserApiFx } from "./@user/withUserApiFx";
import { withUserHono } from "./@user/withUserHono";
import { database } from "./database/kysely";
import { withHono } from "./hono/withHono";
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
		withSellerUserApiFx(),
		withSellerSessionApiFx(),
		withBuyerUserApiFx(),
		withBuyerSessionApiFx(),
	]).pipe(Effect.provide(kyselyContext));

	return root;
}).pipe(
	Effect.provide(
		RoutesContextLayer({
			root: withHono(),
			publicHono: withPublicHono(),
			sessionHono: withSessionHono(),
			userHono: withUserHono(),
			sellerUserHono: withSellerUserHono(),
			sellerSessionHono: withSellerSessionHono(),
			buyerUserHono: withBuyerUserHono(),
			buyerSessionHono: withBuyerSessionHono(),
		}),
	),
	Effect.runPromise,
);

export default app;
