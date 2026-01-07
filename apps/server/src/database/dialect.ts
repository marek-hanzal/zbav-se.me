import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { ServerDatabaseSchema } from "~/schema/ServerDatabaseSchema";

const { SERVER_DATABASE_URL } = ServerDatabaseSchema.parse(process.env);

// TODO Try to Effectize this
export const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: SERVER_DATABASE_URL,
		/**
		 * Keep low, we're serverless so we won't spam the upstream database
		 */
		max: 3,
	}),
});
