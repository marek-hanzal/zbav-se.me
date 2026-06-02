import type { withDatabaseFx } from "@/lib/common/database";
import { genId } from "@/lib/common/gen-id";
import resourceBundleStripeSeedData from "~/server/@migrations/0054-resource-bundle-stripe/resource-bundle-stripe.json" with {
	type: "json",
};
import type { ResourceBundleStripeTableSchema } from "../@table/ResourceBundleStripeTableSchema";
import type { Database } from "../Database";

type ResourceBundleStripeImportRow = ResourceBundleStripeTableSchema.Type;

interface ResourceBundleStripeSeed {
	name: string;
	priceId: string;
	url?: string | null;
}

export const importResourceBundleStripe: withDatabaseFx.Import<Database> = {
	name: "resource-bundle-stripe",
	async run({ kysely }) {
		const resourceBundleStripeRows: ResourceBundleStripeSeed[] = resourceBundleStripeSeedData;

		if (resourceBundleStripeRows.length === 0) {
			return [];
		}

		const resourceBundleNames = [
			...new Set(resourceBundleStripeRows.map((item) => item.name)),
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
		const now = new Date();
		const values = resourceBundleStripeRows.map((item): ResourceBundleStripeImportRow => {
			const resourceBundleId = resourceBundleIdByName.get(item.name);

			if (!resourceBundleId) {
				throw new Error(`Missing resource bundle '${item.name}'`);
			}

			return {
				id: genId(),
				resourceBundleId,
				priceId: item.priceId,
				url: item.url ?? null,
				createdAt: now,
			};
		});

		return kysely
			.insertInto("resource_bundle_stripe")
			.values(values)
			.onConflict((oc) => {
				return oc.column("priceId").doUpdateSet((eb) => ({
					resourceBundleId: eb.ref("excluded.resourceBundleId"),
					url: eb.ref("excluded.url"),
				}));
			})
			.execute();
	},
} as const;
