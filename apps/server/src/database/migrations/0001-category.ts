import type { Migration } from "kysely";

export const CategoryMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("category")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("group", "text", (col) => col.notNull())
			.addColumn("category", "text", (col) => col.notNull())
			.addColumn("slug", "text", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())
			.addColumn("locale", "text", (col) => col.notNull())
			.addUniqueConstraint("category_[slug-locale]_unique_idx", [
				"slug",
				"locale",
			])
			.addUniqueConstraint(
				"category_[locale-group-category]_unique_idx",
				[
					"locale",
					"group",
					"category",
				],
			)
			.execute();
	},
};
