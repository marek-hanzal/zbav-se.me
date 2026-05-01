import { type Migration, sql } from "kysely";
import { toEnumGuard } from "@/lib/common/to-enum-guard";
import type { FieldTypeEnumSchema } from "~/user/field/server/schema/FieldTypeEnumSchema";

export const FieldMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("field_type_enum")
			.asEnum(
				toEnumGuard<FieldTypeEnumSchema.Type>()([
					"number",
					"decimal",
					"year",
					"range",
					"text",
					"enum-single",
					"enum-multi",
				]),
			)
			.execute();

		await db.schema
			.createTable("field")
			.addColumn("name", "text", (col) => col.primaryKey().notNull())
			.addColumn("type", sql`field_type_enum`, (col) => col.notNull())
			.addColumn("min", "decimal(10, 2)")
			.addColumn("max", "decimal(10, 2)")
			.addColumn("step", "decimal(10, 2)")
			.execute();
	},
};
