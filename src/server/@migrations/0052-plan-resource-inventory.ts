import { sql } from "kysely";
import type { Migration } from "kysely/migration";

export const PlanResourceInventoryMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("plan_resource_inventory")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("planId", "text", (col) => col.notNull())
			.addColumn("resourceDefinitionId", "text", (col) => col.notNull())
			.addColumn("amount", "decimal(10, 2)", (col) => col.notNull())
			.addColumn("expiration", "integer")
			.addForeignKeyConstraint(
				"plan_resource_inventory_[planId]_fk",
				[
					"planId",
				],
				"plan",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"plan_resource_inventory_[resourceDefinitionId]_fk",
				[
					"resourceDefinitionId",
				],
				"resource_definition",
				[
					"name",
				],
			)
			.addUniqueConstraint(
				"plan_resource_inventory_[planId-resourceDefinitionId]_unique_idx",
				[
					"planId",
					"resourceDefinitionId",
				],
			)
			.addCheckConstraint("plan_resource_inventory_[amount]_chk", sql`"amount" >= 0`)
			.addCheckConstraint(
				"plan_resource_inventory_[expiration]_chk",
				sql`"expiration" IS NULL OR "expiration" >= 0`,
			)
			.execute();
	},
};
