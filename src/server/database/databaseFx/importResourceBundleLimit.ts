import type { withDatabaseFx } from "@/lib/common/database";
import { genId } from "@/lib/common/gen-id";
import type { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import resourceBundleLimitSeedData from "~/server/@migrations/0049-resource-bundle/resource-bundle-limit.json" with {
	type: "json",
};
import type { ResourceBundleLimitTableSchema } from "../@table/ResourceBundleLimitTableSchema";
import type { Database } from "../Database";

type ResourceBundleLimitImportRow = ResourceBundleLimitTableSchema.Type;

export const importResourceBundleLimit: withDatabaseFx.Import<Database> = {
	name: "resource-bundle-limit",
	async run({ kysely }) {
		const resourceBundleLimits = resourceBundleLimitSeedData;
		const resourceBundleNames = [
			...new Set(resourceBundleLimits.map((item) => item.name)),
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
		const values = resourceBundleLimits.map((item): ResourceBundleLimitImportRow => {
			const resourceBundleId = resourceBundleIdByName.get(item.name);

			if (!resourceBundleId) {
				throw new Error(`Missing resource bundle '${item.name}'`);
			}

			return {
				id: genId(),
				resourceBundleId,
				resourceDefinitionId: item.resource as ResourceDefinitionEnumSchema.Type,
				limit: item.limit,
			};
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
					.doUpdateSet((eb) => ({
						limit: eb.ref("excluded.limit"),
					}));
			})
			.execute();
	},
} as const;
