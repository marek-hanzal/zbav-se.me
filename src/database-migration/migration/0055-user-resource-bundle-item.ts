import { sql } from "kysely";
import type { Migration } from "kysely/migration";

export const UserResourceBundleItemMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("user_resource_bundle_item")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userResourceBundleId", "text", (col) => col.notNull())
			.addColumn("resourceDefinitionId", "text", (col) => col.notNull())
			.addColumn("amount", "decimal(10, 2)", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("availableAt", "timestamptz", (col) => col.notNull())
			.addColumn("expiresAt", "timestamptz")
			.addForeignKeyConstraint(
				"urbi_[urbId]_fk",
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
				"urbi_[rdId]_fk",
				[
					"resourceDefinitionId",
				],
				"resource_definition",
				[
					"name",
				],
			)
			.addCheckConstraint("user_resource_bundle_item_[amount]_chk", sql`"amount" >= 0`)
			.execute();

		await db.schema
			.createIndex("urbi_[urbId]_idx")
			.on("user_resource_bundle_item")
			.column("userResourceBundleId")
			.execute();

		await db.schema
			.createIndex("urbi_[rdId-availableAt]_idx")
			.on("user_resource_bundle_item")
			.columns([
				"resourceDefinitionId",
				"availableAt",
			])
			.execute();
	},
};
