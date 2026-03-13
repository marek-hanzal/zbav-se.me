import { DialectContextFx } from "@use-pico/common/database";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { withS3Fx } from "~/@common/s3/context/withS3Fx";
import { withTransactionContextFx } from "~/@common/transaction/context/withTransactionContextFx";
import { withUploadFx } from "~/@common/upload/context/withUploadFx";
import { withLocationFx } from "~/@session/location/fx/withLocationFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withDateFx } from "~/database/fx/withDateFx";
import { database } from "~/database/kysely";
import { ServerCdnSchema } from "~/schema/env/ServerCdnSchema";
import { ServerDatabaseSchema } from "~/schema/env/ServerDatabaseSchema";
import { ServerGeoapifySchema } from "~/schema/env/ServerGeoapifySchema";
import { ServerS3Schema } from "~/schema/env/ServerS3Schema";
import { withSeedProgressFx } from "~/seed/context/withSeedProgressFx";

export const withSeedRuntimeFx = <A, E, R>(effect: Effect.Effect<A, E, R>) => {
	const databaseConfig = ServerDatabaseSchema.parse(process.env);
	const s3Config = ServerS3Schema.parse(process.env);
	const cdnConfig = ServerCdnSchema.parse(process.env);
	const geoapifyConfig = ServerGeoapifySchema.parse(process.env);

	return Effect.gen(function* () {
		const pool = yield* Effect.acquireRelease(
			Effect.sync(
				() =>
					new Pool({
						connectionString: databaseConfig.SERVER_DATABASE_URL,
						max: 3,
						allowExitOnIdle: true,
						idleTimeoutMillis: 1000,
					}),
			),
			(pool) =>
				Effect.promise(async () => {
					await pool.end();
				}),
		);

		const kysely = yield* database.pipe(
			Effect.provideService(
				DialectContextFx,
				new PostgresDialect({
					pool,
				}),
			),
		);

		return yield* effect.pipe(
			withSeedProgressFx,
			withLocationFx({
				api: "https://api.geoapify.com",
				autocomplete: "/v1/geocode/autocomplete",
				geoapifyToken: geoapifyConfig.SERVER_GEOAPIFY_TOKEN,
			}),
			withS3Fx({
				api: s3Config.SERVER_S3_API,
				key: s3Config.SERVER_S3_KEY,
				secret: s3Config.SERVER_S3_SECRET,
				bucket: s3Config.SERVER_S3_BUCKET,
			}),
			withUploadFx({
				cdn: cdnConfig.SERVER_CONTENT_CDN,
			}),
			withDateFx,
			withTransactionContextFx({
				expires: 3,
				extend: 3,
			}),
			Effect.provideService(KyselyContextFx, kysely),
		);
	});
};
