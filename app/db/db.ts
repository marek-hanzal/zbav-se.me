import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { serverEnv } from "~/env/env.server";
import type { Database } from "./Database";

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: serverEnv().DATABASE_URL,
		max: 10,
	}),
});

export const db = new Kysely<Database>({
	dialect,
});
