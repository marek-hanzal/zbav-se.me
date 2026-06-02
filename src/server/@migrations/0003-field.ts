import { sql } from "kysely";
import type { Migration } from "kysely/migration";
import { toEnumGuard } from "@/lib/common/to-enum-guard";
import type { FieldKindEnumSchema } from "~/user/field/server/schema/FieldKindEnumSchema";
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
			.createType("field_kind_enum")
			.asEnum(
				toEnumGuard<FieldKindEnumSchema.Type>()([
					"recommended",
					"optional",
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
