import type { Migration } from "kysely/migration";

export const ResourceBundleLimitStripeMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("resource_bundle_limit_stripe")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("resourceBundleLimitId", "text", (col) => col.notNull())
			.addColumn("key", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"resource_bundle_limit_stripe_[resourceBundleLimitId]_fk",
				[
					"resourceBundleLimitId",
				],
				"resource_bundle_limit",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint(
				"resource_bundle_limit_stripe_[resourceBundleLimitId-key]_unique_idx",
				[
					"resourceBundleLimitId",
					"key",
				],
			)
			.execute();

		await db.schema
			.createIndex("resource_bundle_limit_stripe_[resourceBundleLimitId-createdAt]_idx")
			.on("resource_bundle_limit_stripe")
			.columns([
				"resourceBundleLimitId",
				"createdAt",
			])
			.execute();
	},
};
