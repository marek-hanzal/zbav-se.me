import type { Database } from "~/database/type/Database";
import { bundles } from "~/database-migration/constant/bundles";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import type { ResourceDefinitionEnumSchema } from "~/resource-definition/schema/ResourceDefinitionEnumSchema";
import type { ResourceBundleEnumSchema } from "~/user-resource-bundle/schema/ResourceBundleEnumSchema";

export const importResourceBundleLimit: withDatabaseFx.Import<Database> = {
	name: "resource-bundle-limit",
	async runFn({ kysely }) {
		const resourceBundleLimits = Object.entries(bundles).flatMap(
			([resourceBundleId, bundle]) => {
				return Object.entries(bundle.limits).map(([resourceDefinitionId, item]) => {
					return {
						resourceBundleId: resourceBundleId as ResourceBundleEnumSchema.Type,
						resourceDefinitionId:
							resourceDefinitionId as ResourceDefinitionEnumSchema.Type,
						limit: item.limit,
					} as const;
				});
			},
		);

		if (resourceBundleLimits.length === 0) {
			return;
		}

		const resourceBundleNames = [
			...new Set(resourceBundleLimits.map((item) => item.resourceBundleId)),
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

		const values = resourceBundleLimits.map((item) => {
			const resourceBundleId = resourceBundleIdByName.get(item.resourceBundleId);

			if (!resourceBundleId) {
				throw new Error(`Missing resource bundle '${item.resourceBundleId}'`);
			}

			return {
				id: genIdFn(),
				resourceBundleId,
				resourceDefinitionId: item.resourceDefinitionId,
				limit: item.limit,
			} as const;
		});

		return kysely
			.insertInto("resource_bundle_limit")
			.values(values)
			.onConflict((oc) => {
				return oc
					.columns([
						"resourceBundleId",
						"resourceDefinitionId",
					])
					.doUpdateSet((ebFn) => ({
						limit: ebFn.ref("excluded.limit"),
					}));
			})
			.execute();
	},
} as const;
