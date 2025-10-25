import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { AppEnv } from "../AppEnv";

export const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: AppEnv.SERVER_DATABASE_URL,
		/**
		 * Keep low, we're serverless so we won't spam the upstream database
		 */
		max: 3,
	}),
});
