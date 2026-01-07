import { withDatabaseFx } from "@use-pico/common/database";
import { runAuthMigration } from "../auth/runAuthMigration";
import type { Database } from "./Database";

/**
 * Don't destructure stuff as there is Proxy
 */
export const database = withDatabaseFx<Database>({
	async onPreMigration({ dialect }) {
		await runAuthMigration(dialect);
	},
});
