import type { withDatabaseFx } from "@/lib/common/database";
import { genId } from "@/lib/common/gen-id";
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
					}),
				),
			)
			.onConflict((oc) => {
				return oc.column("name").doNothing();
			})
			.execute();
	},
} as const;
