import type { ResourceDefinitionTableSchema } from "~/database/schema/ResourceDefinitionTableSchema";
import type { Database } from "~/database/type/Database";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { ResourceDefinitionEnumSchema } from "~/resource-definition/schema/ResourceDefinitionEnumSchema";

export const importResourceDefinition: withDatabaseFx.Import<Database> = {
	name: "resource-definition",
	async runFn({ kysely }) {
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
