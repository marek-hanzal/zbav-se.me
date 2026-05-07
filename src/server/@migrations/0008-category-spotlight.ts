import type { Migration } from "kysely";

export const CategorySpotlightMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("category_spotlight")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("categoryId", "text", (col) => col.notNull())
			.addColumn("text", "text", (col) => col.notNull())
			.addColumn("locale", "text", (col) => col.notNull())
			.addColumn("weight", "integer", (col) => col.notNull())
			.addForeignKeyConstraint(
				"category_spotlight_categoryId_fk",
				[
					"categoryId",
				],
				"category",
				[
					"id",
				],
				(builder) => builder.onDelete("cascade"),
			)
			.addUniqueConstraint("category_spotlight_[categoryId-locale-text]_unique_idx", [
				"categoryId",
				"locale",
				"text",
			])
			.execute();

		await db.schema
			.createIndex("category_spotlight_[categoryId-locale]_idx")
			.on("category_spotlight")
			.columns([
				"categoryId",
				"locale",
			])
			.execute();

		await db.schema
			.createIndex("category_spotlight_[text]_idx")
			.on("category_spotlight")
			.columns([
				"text",
			])
			.execute();
	},
};
