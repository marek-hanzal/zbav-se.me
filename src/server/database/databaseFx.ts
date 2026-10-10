import { Effect } from "effect";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { MigrationContextFx } from "~/database-query/service/MigrationContextFx";
import { migrations } from "~/server/@migrations/migrations";
import { runAuthMigration } from "~/server/auth/runAuthMigration";
import type { Database } from "~/server/database/Database";
import { imports } from "./databaseFx/imports";
import { importTranslations } from "./databaseFx/importTranslations";

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
