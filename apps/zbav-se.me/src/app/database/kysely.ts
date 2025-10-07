import { withDatabase } from "@use-pico/server";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { Database } from "~/app/database/Database";
import { migrations } from "~/app/database/migrations";

export const { kysely, bootstrap } = withDatabase<Database>({
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: process.env.DATABASE_URL,
			max: 5,
		}),
	}),
	async getMigrations() {
		return migrations;
	},
	async bootstrap() {},
});
