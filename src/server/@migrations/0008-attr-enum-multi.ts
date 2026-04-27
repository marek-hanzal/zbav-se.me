import type { Migration } from "kysely";

export const AttrEnumMultiMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("attr_enum_multi")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("fieldId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("value", "text", (col) => col.notNull())
			.addForeignKeyConstraint(
				"attr_enum_multi_[fieldId]_fk",
				["fieldId"],
				"field",
				["id"],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"attr_enum_multi_[listingId]_fk",
				["listingId"],
				"listing",
				["id"],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("attr_enum_multi_[fieldId-value-listingId]_idx")
			.on("attr_enum_multi")
			.columns(["fieldId", "value", "listingId"])
			.execute();

		await db.schema
			.createIndex("attr_enum_multi_[listingId]_idx")
			.on("attr_enum_multi")
			.column("listingId")
			.execute();
	},
};
