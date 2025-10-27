import type { Migration } from "kysely";

export const CategoryMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("category")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("name", "text", (col) => col.notNull())
			.addColumn("slug", "text", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())
			.addColumn("locale", "text", (col) => col.notNull())
			.execute();

		await db.schema
			.createIndex("category_[slug-locale]_unique_idx")
			.on("category")
			.columns([
				"slug",
				"locale",
			])
			.unique()
			.execute();
	},
};
