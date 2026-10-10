import type { Migration } from "kysely/migration";
import type { AccessEnumSchema } from "~/common/access/AccessEnumSchema";
import type { DeliveryEnumSchema } from "~/common/delivery/enum/DeliveryEnumSchema";
import type { PriceTypeEnumSchema } from "~/common/price-type/enum/PriceTypeEnumSchema";
import type { WarrantyEnumSchema } from "~/common/warranty/enum/WarrantyEnumSchema";
import { toEnumGuard } from "~/enum/fn/toEnumGuard";
import type { ResourceBundleTypeEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleTypeEnumSchema";

export const EnumMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("access_enum")
			.asEnum(
				toEnumGuard<AccessEnumSchema.Type>()([
					"public",
					"protected",
					"private",
				]),
			)
			.execute();

		await db.schema
			.createType("price_type_enum")
			.asEnum(
				toEnumGuard<PriceTypeEnumSchema.Type>()([
					"fixed",
					"haggle",
					"ask",
					"free",
					"haulaway",
				]),
			)
			.execute();

		await db.schema
			.createType("delivery_enum")
			.asEnum(
				toEnumGuard<DeliveryEnumSchema.Type>()([
					"personal",
					"post",
					"package",
					"other",
				]),
			)
			.execute();

		await db.schema
			.createType("warranty_enum")
			.asEnum(
				toEnumGuard<WarrantyEnumSchema.Type>()([
					"warranty",
					"no-warranty",
					"custom",
				]),
			)
			.execute();

		await db.schema
			.createType("resource_bundle_type_enum")
			.asEnum(
				toEnumGuard<ResourceBundleTypeEnumSchema.Type>()([
					"package",
					"extra",
					"user",
					"promo",
				] as const),
			)
			.execute();
	},
};
