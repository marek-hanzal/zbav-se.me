import type { Migration } from "kysely";
import { genId } from "@/lib/common/gen-id";
import fieldSeedData from "~/server/@migrations/0005-field-seed/field.json" with { type: "json" };

export const FieldSeedMigration: Migration = {
	async up(db) {
		if (fieldSeedData && Object.keys(fieldSeedData).length > 0) {
			await db
				.insertInto("field")
				.values(
					Object.values(fieldSeedData).map((field) => ({
						id: genId(),
						name: field.name,
						required: field.required,
						group: field.group,
					})),
				)
				.execute();
		}
	},
};
