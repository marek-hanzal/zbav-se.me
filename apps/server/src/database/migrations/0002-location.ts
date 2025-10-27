import type { Migration } from "kysely";

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
			.execute();

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
