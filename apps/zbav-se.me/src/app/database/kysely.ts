import { withDatabase } from "@use-pico/server";
import SQLite from "better-sqlite3";
import { sql, SqliteDialect } from "kysely";
import type { Database } from "~/app/database/Database";
import { migrations } from "~/app/database/migrations";

export const { kysely, bootstrap } = withDatabase<Database>({
	dialect: new SqliteDialect({
		database: new SQLite("./zbav-se.me.sqlite3"),
	}),
	async getMigrations() {
		return migrations;
	},
	async bootstrap({ kysely }) {
		await sql`PRAGMA foreign_keys = ON`.execute(kysely);
		await sql`PRAGMA journal_mode = WAL`.execute(kysely);
	},
});
