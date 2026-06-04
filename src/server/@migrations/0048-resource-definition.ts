import type { Migration } from "kysely/migration";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";

export const ResourceDefinitionMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("resource_definition")
			.addColumn("name", "text", (col) => col.primaryKey().notNull())
			.execute();

		await db
			.insertInto("resource_definition")
			.values(
				ResourceDefinitionEnumSchema.options.map((name) => ({
					name,
				})),
			)
			.execute();
	},
};
