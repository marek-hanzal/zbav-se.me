import { MigrationContextFx, withDatabaseFx } from "@use-pico/common/database";
import { Effect } from "effect";
import { migrations } from "~/server/@migrations/migrations";
import { runAuthMigration } from "~/server/auth/runAuthMigration";
import type { Database } from "~/server/database/Database";

/**
 * Don't destructure stuff as there is Proxy
 */
export const databaseFx = withDatabaseFx<Database>({
	async onPreMigration({ dialect }) {
		await runAuthMigration(dialect);
	},
}).pipe(Effect.provideService(MigrationContextFx, migrations));
