import type { Migration } from "kysely/migration";
import { toEnumGuard } from "~/enum/fn/toEnumGuard";
import type { RestrictionEnumSchema } from "~/restriction/schema/RestrictionEnumSchema";

export const RestrictionMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("restriction_enum")
			.asEnum(
				toEnumGuard<RestrictionEnumSchema.Type>()([
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
