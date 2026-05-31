import { sql } from "kysely";
import type { Migration } from "kysely/migration";

export const PlanResourceLimitMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("plan_resource_limit")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("planId", "text", (col) => col.notNull())
			.addColumn("resourceDefinitionId", "text", (col) => col.notNull())
			.addColumn("duration", "integer")
			.addForeignKeyConstraint(
				"plan_resource_limit_[planId]_fk",
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
				"plan_resource_limit_[resourceDefinitionId]_fk",
				[
					"resourceDefinitionId",
				],
				"resource_definition",
				[
					"name",
				],
			)
			.addUniqueConstraint("plan_resource_limit_[planId-resourceDefinitionId]_unique_idx", [
				"planId",
				"resourceDefinitionId",
			])
			.addCheckConstraint(
				"plan_resource_limit_[duration]_chk",
				sql`"duration" IS NULL OR "duration" >= 0`,
			)
			.execute();
	},
};
