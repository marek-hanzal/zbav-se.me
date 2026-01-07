import { DialectContextProvider } from "@use-pico/common/database";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { AppEnv } from "~/AppEnv";
import { initMiddlewareFx } from "~/middleware/initMiddlewareFx";
import { withPublicApiFx } from "./@public/withPublicApiFx";
import { withRootApi } from "./@root/withRootApi";
import { withSessionApiFx } from "./@session/withSessionApiFx";
import { withUserApiFx } from "./@user/withUserApiFx";
import { RoutesContextFx, RoutesContextProvider } from "./app/routes/RoutesContextFx";
import { KyselyContextProvider } from "./database/context/KyselyContextFx";
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

	const databaseInstance = yield* database.pipe(
		DialectContextProvider(
			new PostgresDialect({
				pool: new Pool({
					connectionString: AppEnv.SERVER_DATABASE_URL,
					max: 3,
				}),
			}),
		),
	);
	yield* initMiddlewareFx();

	yield* Effect.all([
		withRootApi(),
		withPublicApiFx(),
		withSessionApiFx(),
		withUserApiFx(),
	]).pipe(KyselyContextProvider(databaseInstance));

	return root;
}).pipe(
	RoutesContextProvider({
		root: withHono(),
		publicHono: withHono(),
		sessionHono: withSessionHono(),
		userHono: withUserHono(),
	}),
	Effect.runPromise,
);

export default app;
