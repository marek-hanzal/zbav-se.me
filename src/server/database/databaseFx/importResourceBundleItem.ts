import type { withDatabaseFx } from "@/lib/common/database";
import { genId } from "@/lib/common/gen-id";
import { resourceBundleItemSeedData } from "~/server/@migrations/0049-resource-bundle/resource-bundle-item";
import type { ResourceBundleItemTableSchema } from "../@table/ResourceBundleItemTableSchema";
import type { Database } from "../Database";

type ResourceBundleItemImportRow = Pick<
	ResourceBundleItemTableSchema.Type,
	"id" | "resourceBundleId" | "resourceDefinitionId" | "amount" | "expiration"
>;

export const importResourceBundleItem: withDatabaseFx.Import<Database> = {
	name: "resource-bundle-item",
	async run({ kysely }) {
		const resourceBundleItems = resourceBundleItemSeedData;

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
		const values = resourceBundleItems.map((item): ResourceBundleItemImportRow => {
			const resourceBundleId = resourceBundleIdByName.get(item.resourceBundleId);

			if (!resourceBundleId) {
				throw new Error(`Missing resource bundle '${item.resourceBundleId}'`);
			}

			return {
				id: genId(),
				resourceBundleId,
				resourceDefinitionId: item.resourceDefinitionId,
				amount: item.amount,
				expiration: item.expiration,
			};
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
						expiration: eb.ref("excluded.expiration"),
					}));
			})
			.execute();
	},
} as const;
