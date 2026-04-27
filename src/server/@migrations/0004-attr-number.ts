import type { Migration } from "kysely";

export const AttrNumberMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("attr_number")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("fieldId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("value", "integer", (col) => col.notNull())
			//
			.addForeignKeyConstraint(
				"attr_number_[fieldId]_fk",
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
				"attr_number_[listingId]_fk",
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
