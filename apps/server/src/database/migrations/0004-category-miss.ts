import type { Migration } from "kysely";

export const CategoryMissMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("category_miss")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("category", "text", (col) => col.notNull())
			.addColumn("updatedAt", "timestamptz", (col) => col.notNull())
			.addColumn("count", "integer", (col) => col.notNull())
			.addUniqueConstraint("category_miss_[category]_unique_idx", [
				"category",
			])
			.execute();
	},
};
