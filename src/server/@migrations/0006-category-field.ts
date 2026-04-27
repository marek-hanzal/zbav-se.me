import type { Migration } from "kysely";

export const CategoryFieldMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("category_field")
			.addColumn("categoryId", "text", (col) => col.notNull())
			.addColumn("fieldId", "text", (col) => col.notNull())
			.addPrimaryKeyConstraint("category_field_pk", [
				"categoryId",
				"fieldId",
			])
			.addForeignKeyConstraint(
				"category_field_[categoryId]_fk",
				[
					"categoryId",
				],
				"category",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"category_field_[fieldId]_fk",
				[
					"fieldId",
				],
				"field",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();
	},
};
