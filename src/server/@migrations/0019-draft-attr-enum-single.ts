import type { Migration } from "kysely";

export const DraftAttrEnumSingleMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("draft_attr_enum_single")
			.addColumn("draftId", "text", (col) => col.notNull())
			.addColumn("fieldId", "text", (col) => col.notNull())
			.addColumn("value", "text", (col) => col.notNull())

			.addPrimaryKeyConstraint("draft_attr_enum_single_[draftId-fieldId]_pk", [
				"draftId",
				"fieldId",
			])

			.addForeignKeyConstraint(
				"draft_attr_enum_single_[draftId]_fk",
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
				"draft_attr_enum_single_[fieldId]_fk",
				[
					"fieldId",
				],
				"field",
				[
					"name",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"draft_attr_enum_single_[fieldId-value]_fk",
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
			.createIndex("draft_attr_enum_single_[fieldId-value-draftId]_idx")
			.on("draft_attr_enum_single")
			.columns([
				"fieldId",
				"value",
				"draftId",
			])
			.execute();
	},
};
