import type { Migration } from "kysely";
import { toEnumGuard } from "@/lib/common/to-enum-guard";
import type { AccessEnumSchema } from "~/common/access/AccessEnumSchema";

export const AccessMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("access_enum")
			.asEnum(
				toEnumGuard<AccessEnumSchema.Type>()([
					"public",
					"private",
				]),
			)
			.execute();
	},
};
