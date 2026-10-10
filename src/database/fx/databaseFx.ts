import { Effect } from "effect";
import { runAuthMigration } from "~/authentication/fn/runAuthMigration";
import { imports } from "~/database/constant/imports";
import { importTranslations } from "~/database/constant/importTranslations";
import type { Database } from "~/database/type/Database";
import { migrations } from "~/database-migration/constant/migrations";
import { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { MigrationContextFx } from "~/database-query/service/MigrationContextFx";
import { getRootLogger } from "~/log/fn/getRootLogger";

/**
 * Don't destructure stuff as there is Proxy
 */
export const databaseFx = withDatabaseFx<Database>({
	logger: getRootLogger([
		"db",
	]),
	async onPreMigration({ dialect }) {
		await runAuthMigration(dialect);
	},
	imports: [
		importTranslations,
		...imports,
	],
}).pipe(Effect.provideService(MigrationContextFx, migrations));
