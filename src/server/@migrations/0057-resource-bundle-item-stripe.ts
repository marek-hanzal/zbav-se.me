import type { Migration } from "kysely/migration";

export const ResourceBundleItemStripeMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("resource_bundle_item_stripe")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("resourceBundleItemId", "text", (col) => col.notNull())
			.addColumn("key", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"resource_bundle_item_stripe_[resourceBundleItemId]_fk",
				[
					"resourceBundleItemId",
				],
				"resource_bundle_item",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("resource_bundle_item_stripe_[resourceBundleItemId-key]_unique_idx", [
				"resourceBundleItemId",
				"key",
			])
			.execute();
	},
};
