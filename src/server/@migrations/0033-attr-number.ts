import type { Migration } from "kysely";

export const AttrNumberMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("attr_number")
			//
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("fieldId", "text", (col) => col.notNull())
			//
			.addColumn("value", "integer", (col) => col.notNull())

			.addPrimaryKeyConstraint("attr_number_pk", [
				"listingId",
				"fieldId",
			])

			.addForeignKeyConstraint(
				"attr_number_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"attr_number_[fieldId]_fk",
				[
					"fieldId",
				],
				"field",
				[
					"name",
				],
				(c) => c.onDelete("cascade"),
			)

			.execute();

		await db.schema
			.createIndex("attr_number_[fieldId-value-listingId]_idx")
			.on("attr_number")
			.columns([
				"fieldId",
				"value",
				"listingId",
			])
			.execute();
	},
};
