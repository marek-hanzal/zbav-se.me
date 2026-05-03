import type { Migration } from "kysely";

export const ListingAttrTextMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("listing_attr_text")
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("fieldId", "text", (col) => col.notNull())
			.addColumn("value", "text", (col) => col.notNull())

			.addPrimaryKeyConstraint("listing_attr_text_pk", [
				"listingId",
				"fieldId",
			])

			.addForeignKeyConstraint(
				"listing_attr_text_[listingId]_fk",
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
				"listing_attr_text_[fieldId]_fk",
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
			.createIndex("listing_attr_text_[fieldId-listingId]_idx")
			.on("listing_attr_text")
			.columns([
				"fieldId",
				"listingId",
			])
			.execute();
	},
};
