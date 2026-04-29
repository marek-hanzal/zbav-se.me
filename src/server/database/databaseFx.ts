import { Effect } from "effect";
import { MigrationContextFx, withDatabaseFx } from "@/lib/common/database";
import { getRootLogger } from "~/common/log/getRootLogger";
import { migrations } from "~/server/@migrations/migrations";
import { runAuthMigration } from "~/server/auth/runAuthMigration";
import type { Database } from "~/server/database/Database";

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
}).pipe(Effect.provideService(MigrationContextFx, migrations));
