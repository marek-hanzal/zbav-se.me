import type { withDatabaseFx } from "@/lib/common/database";
import { genId } from "@/lib/common/gen-id";
import { resourceBundleFeatureSeedData } from "~/server/@migrations/0049-resource-bundle/resource-bundle-feature";
import type { ResourceBundleFeatureTableSchema } from "../@table/ResourceBundleFeatureTableSchema";
import type { Database } from "../Database";

type ResourceBundleFeatureImportRow = ResourceBundleFeatureTableSchema.Type;

export const importResourceBundleFeature: withDatabaseFx.Import<Database> = {
	name: "resource-bundle-feature",
	async run({ kysely }) {
		const resourceBundleFeatures = resourceBundleFeatureSeedData;

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
		const values = resourceBundleFeatures.map((item): ResourceBundleFeatureImportRow => {
			const resourceBundleId = resourceBundleIdByName.get(item.resourceBundleId);

			if (!resourceBundleId) {
				throw new Error(`Missing resource bundle '${item.resourceBundleId}'`);
			}

			return {
				id: genId(),
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
