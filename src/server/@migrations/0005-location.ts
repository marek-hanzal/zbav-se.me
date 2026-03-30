import type { Migration } from "kysely";
import { sql } from "kysely";

export const LocationMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("location")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("query", "text", (col) => col.notNull())
			.addColumn("lang", "text", (col) => col.notNull())
			//
			.addColumn("country", "text", (col) => col.notNull())
			.addColumn("code", "text", (col) => col.notNull())
			.addColumn("county", "text")
			.addColumn("municipality", "text")
			.addColumn("state", "text")
			//
			.addColumn("address", "text", (col) => col.notNull())
			.addColumn("city", "text")
			.addColumn("street", "text")
			.addColumn("zip", "text")
			//
			.addColumn("confidence", "numeric", (col) => col.notNull())
			//
			.addColumn("hash", "text", (col) => col.notNull())
			//
			.addColumn("lat", "decimal(9, 6)", (col) => col.notNull())
			.addColumn("lon", "decimal(10, 6)", (col) => col.notNull())
			//
			.addColumn("geo", sql`geography(Point,4326)`, (col) =>
				col
					.generatedAlwaysAs(
						sql`
                ST_SetSRID(
                  ST_MakePoint("lon"::double precision, "lat"::double precision),
                  4326
                )::geography
              `,
					)
					.stored(),
			)
			//
			.addCheckConstraint("location_[lat]_chk", sql`"lat" >= -90 AND "lat" <= 90`)
			.addCheckConstraint("location_[lon]_chk", sql`"lon" >= -180 AND "lon" <= 180`)
			.addUniqueConstraint("location_[lang-hash]_unique_idx", [
				"lang",
				"hash",
			])
			.execute();

		await sql`
            CREATE INDEX "location_[geo]_idx" ON "location" USING gist (geo)
        `.execute(db);

		await db.schema
			.createIndex("location_[query-lang]_idx")
			.on("location")
			.columns([
				"query",
				"lang",
			])
			.execute();
	},
};
