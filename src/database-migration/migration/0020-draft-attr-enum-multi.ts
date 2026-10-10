import type { Migration } from "kysely/migration";

export const DraftAttrEnumMultiMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("draft_attr_enum_multi")
			.addColumn("draftId", "text", (col) => col.notNull())
			.addColumn("fieldId", "text", (col) => col.notNull())
			.addColumn("value", "text", (col) => col.notNull())

			.addPrimaryKeyConstraint("draft_attr_enum_multi_[draftId-fieldId-value]_pk", [
				"draftId",
				"fieldId",
				"value",
			])

			.addForeignKeyConstraint(
				"daem_[draftId]_fk",
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
				"daem_[fieldId]_fk",
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
				"daem_[fieldId-value]_fk",
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
			.createIndex("daem_[fieldId-value-draftId]_idx")
			.on("draft_attr_enum_multi")
			.columns([
				"fieldId",
				"value",
				"draftId",
			])
			.execute();
	},
};
