import type { Migration } from "kysely";

export const ListingAttrEnumMultiMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("listing_attr_enum_multi")
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("fieldId", "text", (col) => col.notNull())
			.addColumn("value", "text", (col) => col.notNull())

			.addPrimaryKeyConstraint("listing_attr_enum_multi_[listingId-fieldId-value]_pk", [
				"listingId",
				"fieldId",
				"value",
			])

			.addForeignKeyConstraint(
				"listing_attr_enum_multi_[listingId]_fk",
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
				"listing_attr_enum_multi_[fieldId]_fk",
				[
					"fieldId",
				],
				"field",
				[
					"name",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"listing_attr_enum_multi_[fieldId-value]_fk",
				[
					"fieldId",
					"value",
				],
				"field_option",
				[
					"fieldId",
					"value",
				],
				(c) => c.onDelete("restrict"),
			)

			.execute();

		await db.schema
			.createIndex("listing_attr_enum_multi_[fieldId-value-listingId]_idx")
			.on("listing_attr_enum_multi")
			.columns([
				"fieldId",
				"value",
				"listingId",
			])
			.execute();
	},
};
