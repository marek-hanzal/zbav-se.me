import type { Migration } from "kysely/migration";
import { toEnumGuard } from "@/lib/common/to-enum-guard";
import type { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";

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
