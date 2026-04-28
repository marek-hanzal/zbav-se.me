import { type Migration, sql } from "kysely";

export const FieldMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("field_type_enum")
			.asEnum([
				"number",
				"decimal",
				"text",
				"enum-single",
				"enum-multi",
				"location",
			])
			.execute();

		await db.schema
			.createTable("field")
			.addColumn("name", "text", (col) => col.primaryKey().notNull())
			.addColumn("type", sql`field_type_enum`, (col) => col.notNull())
			.addColumn("required", "boolean", (col) => col.notNull())
			.execute();
	},
};
