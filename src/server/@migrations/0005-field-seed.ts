import type { Migration } from "kysely";
import { genId } from "@/lib/common/gen-id";
import fieldSeedData from "~/server/@migrations/0005-field-seed/field.json" with { type: "json" };
import fieldOptionSeedData from "~/server/@migrations/0005-field-seed/field-option.json" with {
	type: "json",
};

export const FieldSeedMigration: Migration = {
	async up(db) {
		await db
			.insertInto("field")
			.values(
				fieldSeedData.map((field) => ({
					id: genId(),
					...field,
				})),
			)
			.execute();

		await db
			.insertInto("field_option")
			.values(
				fieldOptionSeedData.map(({ field, ...rest }) => ({
					fieldId: db
						.selectFrom("field")
						.select("id")
						.where("name", "=", field.name)
						.where("group", "=", field.group),
					...rest,
				})),
			)
			.execute();
	},
};
