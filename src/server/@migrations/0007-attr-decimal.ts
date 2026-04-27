import type { Migration } from "kysely";

export const AttrDecimalMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("attr_decimal")
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("fieldId", "text", (col) => col.notNull())
			.addColumn("value", "decimal(10, 2)", (col) => col.notNull())

			.addPrimaryKeyConstraint("attr_decimal_pk", [
				"listingId",
				"fieldId",
			])

			.addForeignKeyConstraint(
				"attr_decimal_[listingId]_fk",
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
				"attr_decimal_[fieldId]_fk",
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

		await db.schema
			.createIndex("attr_decimal_[fieldId-value-listingId]_idx")
			.on("attr_decimal")
			.columns([
				"fieldId",
				"value",
				"listingId",
			])
			.execute();
	},
};
