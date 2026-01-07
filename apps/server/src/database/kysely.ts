import { withDatabase } from "@use-pico/common/database";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { runAuthMigration } from "../auth/runAuthMigration";
import type { Database } from "./Database";
import { getMigrations } from "./migrations/getMigrations";

/**
 * Don't destructure stuff as there is Proxy
 */
export const database = withDatabase<Database>({
	dialect() {
		return new PostgresDialect({
			pool: new Pool({
				connectionString: SERVER_DATABASE_URL,
				/**
				 * Keep low, we're serverless so we won't spam the upstream database
				 */
				max: 3,
			}),
		});
	},
	onPreMigration: async () => {
		await runAuthMigration(async () => {
			return import("./dialect").then(({ dialect }) => dialect);
		});
	},
	getMigrations,
});
