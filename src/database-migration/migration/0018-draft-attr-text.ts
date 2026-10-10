import type { Migration } from "kysely/migration";

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
				"dat_[draftId]_fk",
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
				"dat_[fieldId]_fk",
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
			.createIndex("dat_[fieldId-draftId]_idx")
			.on("draft_attr_text")
			.columns([
				"fieldId",
				"draftId",
			])
			.execute();
	},
};
