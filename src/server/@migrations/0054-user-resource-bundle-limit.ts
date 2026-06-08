import { sql } from "kysely";
import type { Migration } from "kysely/migration";

export const UserResourceBundleLimitMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("user_resource_bundle_limit")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userResourceBundleId", "text", (col) => col.notNull())
			.addColumn("resourceDefinitionId", "text", (col) => col.notNull())
			.addColumn("limit", "decimal(10, 2)", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("availableAt", "timestamptz", (col) => col.notNull())
			.addColumn("expiresAt", "timestamptz")
			.addForeignKeyConstraint(
				"user_resource_bundle_limit_[userResourceBundleId]_fk",
				[
					"userResourceBundleId",
				],
				"user_resource_bundle",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"user_resource_bundle_limit_[resourceDefinitionId]_fk",
				[
					"resourceDefinitionId",
				],
				"resource_definition",
				[
					"name",
				],
			)
			.addCheckConstraint("user_resource_bundle_limit_[limit]_chk", sql`"limit" >= 0`)
			.execute();

		await db.schema
			.createIndex("user_resource_bundle_limit_[userResourceBundleId]_idx")
			.on("user_resource_bundle_limit")
			.column("userResourceBundleId")
			.execute();

		await db.schema
			.createIndex("urb_limit_[resource-available]_idx")
			.on("user_resource_bundle_limit")
			.columns([
				"resourceDefinitionId",
				"availableAt",
			])
			.execute();
	},
};
