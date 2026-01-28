import { MigrationContextLayer, withDatabaseFx } from "@use-pico/common/database";
import { Effect } from "effect";
import { migrations } from "~/database/migrations/migrations";
import { runAuthMigration } from "~/auth/runAuthMigration";
import type { Database } from "~/database/Database";

/**
 * Don't destructure stuff as there is Proxy
 */
export const database = withDatabaseFx<Database>({
	async onPreMigration({ dialect }) {
		await runAuthMigration(dialect);
	},
}).pipe(Effect.provide(MigrationContextLayer(migrations)));
