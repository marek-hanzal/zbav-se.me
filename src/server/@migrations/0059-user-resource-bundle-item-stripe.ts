import type { Migration } from "kysely/migration";

export const UserResourceBundleItemStripeMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("user_resource_bundle_item_stripe")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userResourceBundleItemId", "text", (col) => col.notNull())
			.addColumn("key", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"urbis_[urbiId]_fk",
				[
					"userResourceBundleItemId",
				],
				"user_resource_bundle_item",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("urbis_[urbiId-key]_uniq", [
				"userResourceBundleItemId",
				"key",
			])
			.execute();

		await db.schema
			.createIndex("urbis_[key]_idx")
			.on("user_resource_bundle_item_stripe")
			.column("key")
			.execute();
	},
};
