import type { Migration } from "kysely/migration";
import fieldSeedData from "~/database-migration/data/field.json" with { type: "json" };
import fieldOptionSeedData from "~/database-migration/data/field-option.json" with { type: "json" };

export const FieldSeedMigration: Migration = {
	async up(db) {
		await db.insertInto("field").values(fieldSeedData).execute();

		await db
			.insertInto("field_option")
			.values(
				fieldOptionSeedData.map(({ field, ...rest }) => ({
					fieldId: field,
					...rest,
				})),
			)
			.execute();
	},
};
