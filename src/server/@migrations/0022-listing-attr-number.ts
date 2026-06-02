import type { Migration } from "kysely/migration";

export const ListingAttrNumberMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("listing_attr_number")
			//
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("fieldId", "text", (col) => col.notNull())
			//
			.addColumn("value", "integer", (col) => col.notNull())

			.addPrimaryKeyConstraint("listing_attr_number_pk", [
				"listingId",
				"fieldId",
			])

			.addForeignKeyConstraint(
				"listing_attr_number_[listingId]_fk",
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
				"listing_attr_number_[fieldId]_fk",
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
			.createIndex("listing_attr_number_[fieldId-value-listingId]_idx")
			.on("listing_attr_number")
			.columns([
				"fieldId",
				"value",
				"listingId",
			])
			.execute();
	},
};
