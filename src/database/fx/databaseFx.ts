import { Effect } from "effect";
import { runAuthMigrationFn } from "~/authentication/fn/runAuthMigrationFn";
import { imports } from "~/database/constant/imports";
import { importTranslations } from "~/database/constant/importTranslations";
import type { Database } from "~/database/type/Database";
import { migrations } from "~/database-migration/constant/migrations";
import { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { MigrationContextFx } from "~/database-query/service/MigrationContextFx";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";

/**
 * Don't destructure stuff as there is Proxy
 */
export const databaseFx = withDatabaseFx<Database>({
	logger: getRootLoggerFn([
		"db",
	]),
	async onPreMigrationFn({ dialect }) {
		await runAuthMigrationFn(dialect);
	},
	imports: [
		importTranslations,
		...imports,
	],
}).pipe(Effect.provideService(MigrationContextFx, migrations));
