import type { Migration } from "kysely";

export const AttrEnumMultiMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("attr_enum_multi")
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("fieldId", "text", (col) => col.notNull())
			.addColumn("value", "text", (col) => col.notNull())

			.addPrimaryKeyConstraint("attr_enum_multi_[listingId-fieldId-value]_pk", [
				"listingId",
				"fieldId",
				"value",
			])

			.addForeignKeyConstraint(
				"attr_enum_multi_[listingId]_fk",
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
				"attr_enum_multi_[fieldId]_fk",
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
				"attr_enum_multi_[fieldId-value]_fk",
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
			.createIndex("attr_enum_multi_[fieldId-value-listingId]_idx")
			.on("attr_enum_multi")
			.columns([
				"fieldId",
				"value",
				"listingId",
			])
			.execute();
	},
};
