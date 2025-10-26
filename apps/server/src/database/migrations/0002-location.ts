import type { Migration } from "kysely";

export const LocationMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("location")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("query", "varchar(128)", (col) => col.notNull())
			.addColumn("lang", "varchar(8)", (col) => col.notNull())
			//
			.addColumn("country", "varchar(72)", (col) => col.notNull())
			.addColumn("code", "varchar(8)", (col) => col.notNull())
			.addColumn("county", "varchar(128)")
			.addColumn("municipality", "varchar(128)")
			.addColumn("state", "varchar(128)")
			//
			.addColumn("address", "varchar(255)", (col) => col.notNull())
			//
			.addColumn("confidence", "numeric", (col) => col.notNull())
			//
			.addColumn("hash", "varchar(255)", (col) => col.notNull())
			//
			.addColumn("lat", "decimal(9, 6)", (col) => col.notNull())
			.addColumn("lon", "decimal(10, 6)", (col) => col.notNull())
			//
			.execute();

		// Create composite index for fast exact match lookups
		await db.schema
			.createIndex("location_[query-lang]_idx")
			.on("location")
			.columns([
				"query",
				"lang",
			])
			.execute();

		await db.schema
			.createIndex("location_[lang-hash]_unique_idx")
			.on("location")
			.columns([
				"lang",
				"hash",
			])
			.unique()
			.execute();
	},
};
