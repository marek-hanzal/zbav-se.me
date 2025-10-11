import { withDatabase } from "@use-pico/common";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { Database } from "./Database";
import { migrations } from "./migrations";

declare const __DATABASE_URL__: string;

/**
 * Don't destructure stuff as there is Proxy
 */
export const database = withDatabase<Database>({
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: __DATABASE_URL__,
			/**
			 * Keep low, we're serverless so we won't spam the upstream database
			 */
			max: 3,
		}),
	}),
	async getMigrations() {
		return migrations;
	},
});
