import type { Migration } from "kysely/migration";

export const ResourceBundleFeatureStripeMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("resource_bundle_feature_stripe")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("resourceBundleFeatureId", "text", (col) => col.notNull())
			.addColumn("key", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"resource_bundle_feature_stripe_[resourceBundleFeatureId]_fk",
				[
					"resourceBundleFeatureId",
				],
				"resource_bundle_feature",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint(
				"resource_bundle_feature_stripe_[resourceBundleFeatureId-key]_unique_idx",
				[
					"resourceBundleFeatureId",
					"key",
				],
			)
			.execute();

		await db.schema
			.createIndex("resource_bundle_feature_stripe_[resourceBundleFeatureId-createdAt]_idx")
			.on("resource_bundle_feature_stripe")
			.columns([
				"resourceBundleFeatureId",
				"createdAt",
			])
			.execute();
	},
};
