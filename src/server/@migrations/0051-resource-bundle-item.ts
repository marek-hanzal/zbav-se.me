import { sql } from "kysely";
import type { Migration } from "kysely/migration";

export const ResourceBundleItemMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("resource_bundle_item")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("resourceBundleId", "text", (col) => col.notNull())
			.addColumn("resourceDefinitionId", "text", (col) => col.notNull())
			.addColumn("amount", "decimal(10, 2)", (col) => col.notNull())
			.addColumn("expiresAt", "timestamptz")
			.addForeignKeyConstraint(
				"resource_bundle_item_[resourceBundleId]_fk",
				[
					"resourceBundleId",
				],
				"resource_bundle",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"resource_bundle_item_[resourceDefinitionId]_fk",
				[
					"resourceDefinitionId",
				],
				"resource_definition",
				[
					"name",
				],
			)
			.addUniqueConstraint(
				"resource_bundle_item_[resourceBundleId-resourceDefinitionId]_unique_idx",
				[
					"resourceBundleId",
					"resourceDefinitionId",
				],
			)
			.addCheckConstraint("resource_bundle_item_[amount]_chk", sql`"amount" >= 0`)
			.execute();
	},
};
