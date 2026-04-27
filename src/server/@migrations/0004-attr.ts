import type { Migration } from "kysely";

export const AttrMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("attr")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("fieldId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			//
			.addForeignKeyConstraint(
				"attr_[fieldId]_fk",
				[
					"fieldId",
				],
				"field",
				[
					"id",
				],
				(c) => {
					return c.onDelete("cascade");
				},
			)
			.addForeignKeyConstraint(
				"attr_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => {
					return c.onDelete("cascade");
				},
			)
			//
			.execute();
	},
};
