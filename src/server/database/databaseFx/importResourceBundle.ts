import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { genId } from "~/identity/fn/genId";
import { bundles } from "~/server/@migrations/0049-resource-bundle/bundles";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";
import type { ResourceBundleTableSchema } from "../@table/ResourceBundleTableSchema";
import type { Database } from "../Database";

export const importResourceBundle: withDatabaseFx.Import<Database> = {
	name: "resource-bundle",
	async run({ kysely }) {
		return kysely
			.insertInto("resource_bundle")
			.values(
				ResourceBundleEnumSchema.options.map(
					(name): ResourceBundleTableSchema.Type => ({
						id: genId(),
						name,
						type: bundles[name].type,
						access: bundles[name].access,
						sort: bundles[name].sort,
					}),
				),
			)
			.onConflict((oc) => {
				return oc.column("name").doNothing();
			})
			.execute();
	},
} as const;
