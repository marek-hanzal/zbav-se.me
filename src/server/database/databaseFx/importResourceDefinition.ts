import type { withDatabaseFx } from "@/lib/common/database";
import resourceDefinitionSeedData from "~/server/@migrations/0048-resource-definition/resource-definition.json" with {
	type: "json",
};
import type { ResourceDefinitionTableSchema } from "../@table/ResourceDefinitionTableSchema";
import type { Database } from "../Database";

export const importResourceDefinition: withDatabaseFx.Import<Database> = {
	name: "resource-definition",
	async run({ kysely }) {
		return kysely
			.insertInto("resource_definition")
			.values(resourceDefinitionSeedData as ResourceDefinitionTableSchema.Type[])
			.onConflict((oc) => {
				return oc.column("name").doNothing();
			})
			.execute();
	},
} as const;
