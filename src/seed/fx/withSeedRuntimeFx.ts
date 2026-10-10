import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import Pool from "pg-pool";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { databaseFx } from "~/database/fx/databaseFx";
import { withDialectFn } from "~/database-query/fn/withDialectFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withS3ConfigEnvFn } from "~/s3/fn/withS3ConfigEnvFn";
import { withS3ConfigFn } from "~/s3/fn/withS3ConfigFn";
import { ServerDatabaseSchema } from "~/server-env/schema/ServerDatabaseSchema";
import { withLocationConfigEnvFn } from "~/session-location/fn/withLocationConfigEnvFn";
import { withLocationConfigFn } from "~/session-location/fn/withLocationConfigFn";
import { withTransactionContextFn } from "~/user-transaction/fn/withTransactionContextFn";
import { withUploadConfigEnvFn } from "~/user-upload/fn/withUploadConfigEnvFn";
import { withUploadConfigFn } from "~/user-upload/fn/withUploadConfigFn";

export const withSeedRuntimeFx = <A, E, R>(effect: Effect.Effect<A, E, R>) => {
	const databaseConfig = ServerDatabaseSchema.parse(process.env);
	const logger = getRootLoggerFn("seed");

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
			withDialectFn(
				new PostgresDialect({
					pool,
				}),
			),
		);

		return yield* effect.pipe(
			withLoggerFn(logger),
			withKyselyFn(kysely),
			withDateServiceFn(),
			withTransactionContextFn(),
			withS3ConfigFn(withS3ConfigEnvFn()),
			withUploadConfigFn(withUploadConfigEnvFn()),
			withLocationConfigFn(
				withLocationConfigEnvFn({
					api: "https://api.geoapify.com",
					autocomplete: "/v1/geocode/autocomplete",
					route: "/v1/routematrix",
				}),
			),
		);
	});
};
