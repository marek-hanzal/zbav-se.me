import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import Pool from "pg-pool";
import { withDialectFx } from "@/lib/common/database";
import { withDateServiceFx } from "@/lib/common/date";
import { withLoggerFx } from "@/lib/common/log";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withS3ConfigFx } from "~/common/s3/server/context/withS3ConfigFx";
import { withS3ConfigEnv } from "~/common/s3/server/env/withS3ConfigEnv";
import { databaseFx } from "~/server/database/databaseFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { ServerDatabaseSchema } from "~/server/env/ServerDatabaseSchema";
import { withLocationConfigFx } from "~/session/location/server/context/withLocationConfigFx";
import { withLocationConfigEnv } from "~/session/location/server/env/withLocationConfigEnv";
import { withTransactionContextFx } from "~/user/transaction/server/context/withTransactionContextFx";
import { withUploadConfigFx } from "~/user/upload/server/context/withUploadConfigFx";
import { withUploadConfigEnv } from "~/user/upload/server/env/withUploadConfigEnv";

export const withSeedRuntimeFx = <A, E, R>(effect: Effect.Effect<A, E, R>) => {
	const databaseConfig = ServerDatabaseSchema.parse(process.env);
	const logger = getRootLogger("seed");

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
			withLoggerFx(logger),
			withKyselyFx(kysely),
			withDateServiceFx(),
			withTransactionContextFx(),
			withS3ConfigFx(withS3ConfigEnv()),
			withUploadConfigFx(withUploadConfigEnv()),
			withLocationConfigFx(
				withLocationConfigEnv({
					api: "https://api.geoapify.com",
					autocomplete: "/v1/geocode/autocomplete",
					route: "/v1/routematrix",
				}),
			),
		);
	});
};
