import type { Migration } from "kysely";

export const AttrTextMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("attr_text")
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("fieldId", "text", (col) => col.notNull())
			.addColumn("value", "text", (col) => col.notNull())

			.addPrimaryKeyConstraint("attr_text_pk", [
				"listingId",
				"fieldId",
			])

			.addForeignKeyConstraint(
				"attr_text_[listingId]_fk",
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
				"attr_text_[fieldId]_fk",
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
			.createIndex("attr_text_[fieldId-listingId]_idx")
			.on("attr_text")
			.columns([
				"fieldId",
				"listingId",
			])
			.execute();
	},
};
