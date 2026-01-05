import { withDatabase } from "@use-pico/common/database";
import { runAuthMigration } from "../auth/runAuthMigration";
import type { Database } from "./Database";
import { getMigrations } from "./migrations/getMigrations";

/**
 * Don't destructure stuff as there is Proxy
 */
export const database = withDatabase<Database>({
	dialect: async () => {
		return import("./dialect").then(({ dialect }) => dialect);
	},
	onPreMigration: async () => {
		await runAuthMigration(async () => {
			return import("./dialect").then(({ dialect }) => dialect);
		});
	},
	getMigrations,
});
