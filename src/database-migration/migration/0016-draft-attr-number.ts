import type { Migration } from "kysely/migration";

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
				"dan_[draftId]_fk",
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
				"dan_[fieldId]_fk",
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
			.createIndex("dan_[fieldId-value-draftId]_idx")
			.on("draft_attr_number")
			.columns([
				"fieldId",
				"value",
				"draftId",
			])
			.execute();
	},
};
