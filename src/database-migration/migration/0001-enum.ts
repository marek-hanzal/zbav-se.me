import type { Migration } from "kysely/migration";
import type { AccessEnumSchema } from "~/access/schema/AccessEnumSchema";
import type { DeliveryEnumSchema } from "~/delivery/schema/DeliveryEnumSchema";
import { toEnumGuard } from "~/enum/fn/toEnumGuard";
import type { PriceTypeEnumSchema } from "~/price-type/schema/PriceTypeEnumSchema";
import type { ResourceBundleTypeEnumSchema } from "~/user-resource-bundle/schema/ResourceBundleTypeEnumSchema";
import type { WarrantyEnumSchema } from "~/warranty/schema/WarrantyEnumSchema";

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
