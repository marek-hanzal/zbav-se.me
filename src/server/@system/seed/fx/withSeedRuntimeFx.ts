import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import Pool from "pg-pool";
import { withDialectFx } from "@/lib/common/database";
import { withLoggerFx } from "@/lib/common/log";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withS3Fx } from "~/common/s3/server/context/withS3Fx";
import { withSeedProgressFx } from "~/server/@system/seed/context/withSeedProgressFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { databaseFx } from "~/server/database/databaseFx";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { ServerDatabaseSchema } from "~/server/env/ServerDatabaseSchema";
import { ServerGeoapifySchema } from "~/server/env/ServerGeoapifySchema";
import { ServerS3Schema } from "~/server/env/ServerS3Schema";
import { ServerViteSchema } from "~/server/env/ServerViteSchema";
import { withLocationFx } from "~/session/location/server/fx/withLocationFx";
import { withTransactionContextFx } from "~/user/transaction/server/context/withTransactionContextFx";
import { withUploadFx } from "~/user/upload/server/context/withUploadFx";

export const withSeedRuntimeFx = <A, E, R>(effect: Effect.Effect<A, E, R>) => {
	const databaseConfig = ServerDatabaseSchema.parse(process.env);
	const s3Config = ServerS3Schema.parse(process.env);
	const geoapifyConfig = ServerGeoapifySchema.parse(process.env);
	const viteConfig = ServerViteSchema.parse(process.env);
	const logger = getRootLogger();

	return Effect.gen(function* () {
		const pool = yield* Effect.acquireRelease(
			Effect.sync(() => {
				return new Pool({
					connectionString: databaseConfig.SERVER_DATABASE_URL,
					max: 3,
					allowExitOnIdle: true,
					idleTimeoutMillis: 1000,
				});
			}),
			(pool) => {
				return Effect.promise(async () => {
					await pool.end();
				});
			},
		);

		const kysely = yield* databaseFx.pipe(
			withDialectFx(
				new PostgresDialect({
					pool,
				}),
			),
		);

		return yield* effect.pipe(
			withSeedProgressFx,
			withLoggerFx(logger),
			withLocationFx({
				api: "https://api.geoapify.com",
				autocomplete: "/v1/geocode/autocomplete",
				geoapifyToken: geoapifyConfig.SERVER_GEOAPIFY_TOKEN,
				route: "/v1/routematrix",
			}),
			withS3Fx({
				api: s3Config.SERVER_S3_API,
				key: s3Config.SERVER_S3_KEY,
				secret: s3Config.SERVER_S3_SECRET,
				bucket: s3Config.SERVER_S3_BUCKET,
			}),
			withUploadFx({
				cdn: viteConfig.VITE_CONTENT_CDN,
			}),
			withDateFx,
			withTransactionContextFx(),
			Effect.provideService(KyselyContextFx, kysely),
		);
	});
};
