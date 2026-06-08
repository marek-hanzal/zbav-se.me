import { sql } from "kysely";
import type { Migration } from "kysely/migration";

export const ResourceBundleLimitMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("resource_bundle_limit")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("resourceBundleId", "text", (col) => col.notNull())
			.addColumn("resourceDefinitionId", "text", (col) => col.notNull())
			.addColumn("limit", "decimal(10, 2)", (col) => col.notNull())
			.addColumn("expiresAt", "timestamptz")
			.addForeignKeyConstraint(
				"resource_bundle_limit_[resourceBundleId]_fk",
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
				"resource_bundle_limit_[resourceDefinitionId]_fk",
				[
					"resourceDefinitionId",
				],
				"resource_definition",
				[
					"name",
				],
			)
			.addUniqueConstraint(
				"resource_bundle_limit_[bundle-resource]_uniq",
				[
					"resourceBundleId",
					"resourceDefinitionId",
				],
			)
			.addCheckConstraint("resource_bundle_limit_[limit]_chk", sql`"limit" >= 0`)
			.execute();
	},
};
