import type { Migration } from "kysely";

export const AttrEnumSingleMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("attr_enum_single")
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("fieldId", "text", (col) => col.notNull())
			.addColumn("value", "text", (col) => col.notNull())

			.addPrimaryKeyConstraint("attr_enum_single_[listingId-fieldId]_pk", [
				"listingId",
				"fieldId",
			])

			.addForeignKeyConstraint(
				"attr_enum_single_[fieldId]_fk",
				[
					"fieldId",
				],
				"field",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"attr_enum_single_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)

			.execute();

		await db.schema
			.createIndex("attr_enum_single_[fieldId-value-listingId]_idx")
			.on("attr_enum_single")
			.columns([
				"fieldId",
				"value",
				"listingId",
			])
			.execute();
	},
};
