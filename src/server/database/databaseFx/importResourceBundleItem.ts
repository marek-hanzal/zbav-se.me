import type { withDatabaseFx } from "@/lib/common/database";
import { genId } from "@/lib/common/gen-id";
import type { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import { bundles } from "~/server/@migrations/0049-resource-bundle/bundles";
import type { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";
import type { Database } from "../Database";

export const importResourceBundleItem: withDatabaseFx.Import<Database> = {
	name: "resource-bundle-item",
	async run({ kysely }) {
		const resourceBundleItems = Object.entries(bundles).flatMap(
			([resourceBundleId, bundle]) => {
				return Object.entries(bundle.items).map(([resourceDefinitionId, item]) => {
					return {
						resourceBundleId: resourceBundleId as ResourceBundleEnumSchema.Type,
						resourceDefinitionId:
							resourceDefinitionId as ResourceDefinitionEnumSchema.Type,
						amount: item.amount,
						expiresAt: null,
					} as const;
				});
			},
		);

		if (resourceBundleItems.length === 0) {
			return;
		}

		const resourceBundleNames = [
			...new Set(resourceBundleItems.map((item) => item.resourceBundleId)),
		];

		const resourceBundles = await kysely
			.selectFrom("resource_bundle")
			.select([
				"id",
				"name",
			])
			.where("name", "in", resourceBundleNames)
			.execute();

		const resourceBundleIdByName = new Map(
			resourceBundles.map((resourceBundle) => [
				resourceBundle.name,
				resourceBundle.id,
			]),
		);

		const values = resourceBundleItems.map((item) => {
			const resourceBundleId = resourceBundleIdByName.get(item.resourceBundleId);

			if (!resourceBundleId) {
				throw new Error(`Missing resource bundle '${item.resourceBundleId}'`);
			}

			return {
				id: genId(),
				resourceBundleId,
				resourceDefinitionId: item.resourceDefinitionId,
				amount: item.amount,
				expiresAt: item.expiresAt,
			} as const;
		});

		return kysely
			.insertInto("resource_bundle_item")
			.values(values)
			.onConflict((oc) => {
				return oc
					.columns([
						"resourceBundleId",
						"resourceDefinitionId",
					])
					.doUpdateSet((eb) => ({
						amount: eb.ref("excluded.amount"),
						expiresAt: eb.ref("excluded.expiresAt"),
					}));
			})
			.execute();
	},
} as const;
