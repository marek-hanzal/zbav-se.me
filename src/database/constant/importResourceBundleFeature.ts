import type { ResourceBundleFeatureTableSchema } from "~/database/schema/ResourceBundleFeatureTableSchema";
import type { Database } from "~/database/type/Database";
import { bundles } from "~/database-migration/constant/bundles";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import type { ResourceDefinitionEnumSchema } from "~/resource-definition/schema/ResourceDefinitionEnumSchema";
import type { ResourceBundleEnumSchema } from "~/user-resource-bundle/schema/ResourceBundleEnumSchema";

export const importResourceBundleFeature: withDatabaseFx.Import<Database> = {
	name: "resource-bundle-feature",
	async runFn({ kysely }) {
		const resourceBundleFeatures = Object.entries(bundles).flatMap(
			([resourceBundleId, bundle]) => {
				return Object.keys(bundle.features).map((resourceDefinitionId) => {
					return {
						resourceBundleId: resourceBundleId as ResourceBundleEnumSchema.Type,
						resourceDefinitionId:
							resourceDefinitionId as ResourceDefinitionEnumSchema.Type,
					} as const;
				});
			},
		);

		if (resourceBundleFeatures.length === 0) {
			return;
		}

		const resourceBundleNames = [
			...new Set(resourceBundleFeatures.map((item) => item.resourceBundleId)),
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

		const values = resourceBundleFeatures.map((item): ResourceBundleFeatureTableSchema.Type => {
			const resourceBundleId = resourceBundleIdByName.get(item.resourceBundleId);

			if (!resourceBundleId) {
				throw new Error(`Missing resource bundle '${item.resourceBundleId}'`);
			}

			return {
				id: genIdFn(),
				resourceBundleId,
				resourceDefinitionId: item.resourceDefinitionId,
			};
		});

		return kysely
			.insertInto("resource_bundle_feature")
			.values(values)
			.onConflict((oc) => {
				return oc
					.columns([
						"resourceBundleId",
						"resourceDefinitionId",
					])
					.doNothing();
			})
			.execute();
	},
} as const;
