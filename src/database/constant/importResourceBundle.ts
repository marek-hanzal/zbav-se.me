import type { ResourceBundleTableSchema } from "~/database/schema/ResourceBundleTableSchema";
import type { Database } from "~/database/type/Database";
import { bundles } from "~/database-migration/constant/bundles";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { genId } from "~/identity/fn/genId";
import { ResourceBundleEnumSchema } from "~/user-resource-bundle/schema/ResourceBundleEnumSchema";

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
