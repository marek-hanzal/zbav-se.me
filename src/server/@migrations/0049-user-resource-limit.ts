import { sql } from "kysely";
import type { Migration } from "kysely/migration";

export const UserResourceLimitMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("user_resource_limit")
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("resourceDefinitionId", "text", (col) => col.notNull())
			.addColumn("reference", "text")
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("availableAt", "timestamptz", (col) => col.notNull())
			.addColumn("expiresAt", "timestamptz")
			.addColumn("limit", "decimal(10, 2)", (col) => col.notNull())
			.addForeignKeyConstraint(
				"user_resource_limit_[userId]_fk",
				[
					"userId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"user_resource_limit_[resourceDefinitionId]_fk",
				[
					"resourceDefinitionId",
				],
				"resource_definition",
				[
					"name",
				],
			)
			.addCheckConstraint("user_resource_limit_[limit]_chk", sql`"limit" >= 0`)
			.execute();

		await sql`
			CREATE INDEX "user_resource_limit_[userId-resourceDefinitionId-availableAt]_idx"
			ON "user_resource_limit" ("userId", "resourceDefinitionId", "availableAt" DESC);
		`.execute(db);

		await sql`
			CREATE INDEX "user_resource_limit_[userId-resourceDefinitionId-expiresAt]_idx"
			ON "user_resource_limit" ("userId", "resourceDefinitionId", "expiresAt");
		`.execute(db);

		await sql`
			CREATE INDEX "user_resource_limit_[userId-createdAt]_idx"
			ON "user_resource_limit" ("userId", "createdAt" DESC);
		`.execute(db);
	},
};
