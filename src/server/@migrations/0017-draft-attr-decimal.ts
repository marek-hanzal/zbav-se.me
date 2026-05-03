import type { Migration } from "kysely";

export const DraftAttrDecimalMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("draft_attr_decimal")
			.addColumn("draftId", "text", (col) => col.notNull())
			.addColumn("fieldId", "text", (col) => col.notNull())
			.addColumn("value", "decimal(10, 2)", (col) => col.notNull())

			.addPrimaryKeyConstraint("draft_attr_decimal_pk", [
				"draftId",
				"fieldId",
			])

			.addForeignKeyConstraint(
				"draft_attr_decimal_[draftId]_fk",
				[
					"draftId",
				],
				"draft",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"draft_attr_decimal_[fieldId]_fk",
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
			.createIndex("draft_attr_decimal_[fieldId-value-draftId]_idx")
			.on("draft_attr_decimal")
			.columns([
				"fieldId",
				"value",
				"draftId",
			])
			.execute();
	},
};
