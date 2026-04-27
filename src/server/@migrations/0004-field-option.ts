import type { Migration } from "kysely";

export const FieldOptionMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("field_option")
			//
			.addColumn("fieldId", "text", (col) => col.notNull())
			.addColumn("value", "text", (col) => col.notNull())
			.addColumn("label", "text", (col) => col.notNull())
			.addColumn("sort", "integer", (col) => col.notNull())

			.addPrimaryKeyConstraint("field_option_[fieldId-value]_pk", [
				"fieldId",
				"value",
			])

			.addForeignKeyConstraint(
				"field_option_[fieldId]_fk",
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
			.createIndex("field_option_[fieldId-sort]_idx")
			.on("field_option")
			.columns([
				"fieldId",
				"sort",
			])
			.execute();
	},
};
