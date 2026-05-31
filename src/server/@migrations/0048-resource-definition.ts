import type { Migration } from "kysely/migration";
import resourceDefinitionSeedData from "~/server/@migrations/0048-resource-definition/resource-definition.json" with {
	type: "json",
};

export const ResourceDefinitionMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("resource_definition")
			.addColumn("name", "text", (col) => col.primaryKey().notNull())
			.execute();

		await db.insertInto("resource_definition").values(resourceDefinitionSeedData).execute();
	},
};
