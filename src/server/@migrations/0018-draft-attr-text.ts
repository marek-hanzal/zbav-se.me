import type { Migration } from "kysely";

export const DraftAttrTextMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("draft_attr_text")
			.addColumn("draftId", "text", (col) => col.notNull())
			.addColumn("fieldId", "text", (col) => col.notNull())
			.addColumn("value", "text", (col) => col.notNull())

			.addPrimaryKeyConstraint("draft_attr_text_pk", [
				"draftId",
				"fieldId",
			])

			.addForeignKeyConstraint(
				"draft_attr_text_[draftId]_fk",
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
				"draft_attr_text_[fieldId]_fk",
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
			.createIndex("draft_attr_text_[fieldId-draftId]_idx")
			.on("draft_attr_text")
			.columns([
				"fieldId",
				"draftId",
			])
			.execute();
	},
};
