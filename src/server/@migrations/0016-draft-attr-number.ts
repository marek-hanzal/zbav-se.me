import type { Migration } from "kysely";

export const DraftAttrNumberMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("draft_attr_number")
			//
			.addColumn("draftId", "text", (col) => col.notNull())
			.addColumn("fieldId", "text", (col) => col.notNull())
			//
			.addColumn("value", "integer", (col) => col.notNull())

			.addPrimaryKeyConstraint("draft_attr_number_pk", [
				"draftId",
				"fieldId",
			])

			.addForeignKeyConstraint(
				"draft_attr_number_[draftId]_fk",
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
				"draft_attr_number_[fieldId]_fk",
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
			.createIndex("draft_attr_number_[fieldId-value-draftId]_idx")
			.on("draft_attr_number")
			.columns([
				"fieldId",
				"value",
				"draftId",
			])
			.execute();
	},
};
