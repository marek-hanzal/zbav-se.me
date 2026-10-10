import { sql } from "kysely";
import type { Migration } from "kysely/migration";

export const PostgresExtensionsMigration: Migration = {
	async up(db) {
		await sql`CREATE EXTENSION IF NOT EXISTS unaccent`.execute(db);
		await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`.execute(db);
		await sql`CREATE EXTENSION IF NOT EXISTS postgis`.execute(db);
		await sql`CREATE EXTENSION IF NOT EXISTS vector`.execute(db);
		await sql`
			CREATE OR REPLACE FUNCTION immutable_unaccent(value text)
			RETURNS text
			LANGUAGE sql
			IMMUTABLE
			PARALLEL SAFE
			RETURNS NULL ON NULL INPUT
			AS $$
				SELECT public.unaccent(value)
			$$
		`.execute(db);
	},
};
