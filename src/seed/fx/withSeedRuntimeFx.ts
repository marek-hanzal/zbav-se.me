import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import Pool from "pg-pool";
import { databaseFx } from "~/database/fx/databaseFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withDialectFx } from "~/database-query/fx/withDialectFx";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withS3ConfigFx } from "~/s3/context/withS3ConfigFx";
import { withS3ConfigEnv } from "~/s3/schema/withS3ConfigEnv";
import { ServerDatabaseSchema } from "~/server-env/schema/ServerDatabaseSchema";
import { withLocationConfigFx } from "~/session-location/context/withLocationConfigFx";
import { withLocationConfigEnv } from "~/session-location/schema/withLocationConfigEnv";
import { withTransactionContextFx } from "~/user-transaction/context/withTransactionContextFx";
import { withUploadConfigFx } from "~/user-upload/context/withUploadConfigFx";
import { withUploadConfigEnv } from "~/user-upload/schema/withUploadConfigEnv";

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
