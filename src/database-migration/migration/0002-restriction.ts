import type { Migration } from "kysely/migration";
import { toEnumGuardFn } from "~/enum/fn/toEnumGuardFn";
import type { RestrictionEnumSchema } from "~/restriction/schema/RestrictionEnumSchema";

export const RestrictionMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("restriction_enum")
			.asEnum(
				toEnumGuardFn<RestrictionEnumSchema.Type>()([
					"none",
					"adult-relaxed",
					"adult",
					"sensitive",
					"restricted",
				] as const),
			)
			.execute();
	},
};
