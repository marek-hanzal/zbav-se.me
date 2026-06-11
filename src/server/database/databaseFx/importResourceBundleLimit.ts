import type { withDatabaseFx } from "@/lib/common/database";
import { genId } from "@/lib/common/gen-id";
import type { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import { bundles } from "~/server/@migrations/0049-resource-bundle/bundles";
import type { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";
import type { Database } from "../Database";

export const importResourceBundleLimit: withDatabaseFx.Import<Database> = {
	name: "resource-bundle-limit",
	async run({ kysely }) {
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
				id: genId(),
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
					.doUpdateSet((eb) => ({
						limit: eb.ref("excluded.limit"),
					}));
			})
			.execute();
	},
} as const;
