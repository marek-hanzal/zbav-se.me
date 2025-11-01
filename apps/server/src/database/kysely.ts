import { withDatabase } from "@use-pico/common/database";
import { runAuthMigration } from "../auth/runAuthMigration";
import type { Database } from "./Database";
import { dialect } from "./dialect";
import { migrations } from "./migrations";

/**
 * Don't destructure stuff as there is Proxy
 */
export const database = withDatabase<Database>({
	dialect,
	onPreMigration: runAuthMigration,
	async getMigrations() {
		return migrations;
	},
});
