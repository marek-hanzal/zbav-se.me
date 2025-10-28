import type { Migration } from "kysely";

export const CategoryMissMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("category_miss")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("category", "text", (col) => col.notNull())
			.addColumn("updatedAt", "timestamp", (col) => col.notNull())
			.addColumn("count", "integer", (col) => col.notNull())
			.execute();

		await db.schema
			.createIndex("category_miss_[category]_unique_idx")
			.on("category_miss")
			.columns([
				"category",
			])
			.unique()
			.execute();
	},
};
