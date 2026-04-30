import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import Pool from "pg-pool";
import { MigrationContextFx, withDatabaseFx, withDialectFx } from "@/lib/common/database";
import { getRootLogger } from "~/common/log/getRootLogger";
import { translationSyncFx } from "~/common/translation/server/fx/translationSyncFx";
import { migrations } from "~/server/@migrations/migrations";
import { runAuthMigration } from "~/server/auth/runAuthMigration";
import type { Database } from "~/server/database/Database";
import { ServerDatabaseSchema } from "../env/ServerDatabaseSchema";
import { withKyselyFx } from "./fx/withKyselyFx";

/**
 * Don't destructure stuff as there is Proxy
 */
export const databaseFx = withDatabaseFx<Database>({
	logger: getRootLogger([
		"db",
	]),
	async onPreMigration({ dialect }) {
		{
			const databaseConfig = ServerDatabaseSchema.parse(process.env);
			const database = await databaseFx.pipe(
				withDialectFx(
					new PostgresDialect({
						pool: new Pool({
							connectionString: databaseConfig.SERVER_DATABASE_URL,
							max: 3,
						}),
					}),
				),
				Effect.runPromise,
			);

			const dir = dirname(fileURLToPath(import.meta.url));

			await translationSyncFx({
				source: `${dir}/../@migrations/translation`,
			}).pipe(withKyselyFx(database), Effect.runPromise);
		}

		await runAuthMigration(dialect);
	},
}).pipe(Effect.provideService(MigrationContextFx, migrations));
