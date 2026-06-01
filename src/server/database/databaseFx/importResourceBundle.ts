import type { withDatabaseFx } from "@/lib/common/database";
import { genId } from "@/lib/common/gen-id";
import resourceBundleSeedData from "~/server/@migrations/0049-resource-bundle/resource-bundle.json" with {
	type: "json",
};
import type { ResourceBundleTableSchema } from "../@table/ResourceBundleTableSchema";
import type { Database } from "../Database";

export const importResourceBundle: withDatabaseFx.Import<Database> = {
	name: "resource-bundle",
	async run({ kysely }) {
		return kysely
			.insertInto("resource_bundle")
			.values(
				resourceBundleSeedData.map((resourceBundle) => ({
					id: genId(),
					...resourceBundle,
				})) as ResourceBundleTableSchema.Type[],
			)
			.onConflict((oc) => {
				return oc.column("name").doNothing();
			})
			.execute();
	},
} as const;
