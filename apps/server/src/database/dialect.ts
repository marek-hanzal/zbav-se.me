import { PostgresDialect } from "kysely";
import { Pool } from "pg";

declare const __DATABASE_URL__: string;

export const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: __DATABASE_URL__,
		/**
		 * Keep low, we're serverless so we won't spam the upstream database
		 */
		max: 3,
	}),
});
