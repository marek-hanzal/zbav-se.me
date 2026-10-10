import type { Database } from "~/database/type/Database";
import { bundles } from "~/database-migration/constant/bundles";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { genId } from "~/identity/fn/genId";
import type { ResourceDefinitionEnumSchema } from "~/resource-definition/schema/ResourceDefinitionEnumSchema";
import type { ResourceBundleEnumSchema } from "~/user-resource-bundle/schema/ResourceBundleEnumSchema";

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
					}));
			})
			.execute();
	},
} as const;
