import type { Migration } from "kysely";
import { sql } from "kysely";

export const PostgresExtensionsMigration: Migration = {
	async up(db) {
		await sql`CREATE EXTENSION IF NOT EXISTS unaccent`.execute(db);
		await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`.execute(db);
		await sql`CREATE EXTENSION IF NOT EXISTS postgis`.execute(db);
	},
};
