import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import type { ResourceDefinitionTableSchema } from "../@table/ResourceDefinitionTableSchema";
import type { Database } from "../Database";

export const importResourceDefinition: withDatabaseFx.Import<Database> = {
	name: "resource-definition",
	async run({ kysely }) {
		return kysely
			.insertInto("resource_definition")
			.values(
				ResourceDefinitionEnumSchema.options.map(
					(name): ResourceDefinitionTableSchema.Type => ({
						name,
					}),
				),
			)
			.onConflict((oc) => {
				return oc.column("name").doNothing();
			})
			.execute();
	},
} as const;
