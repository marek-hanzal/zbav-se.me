import type { Migration } from "kysely/migration";

export const UserResourceBundleFeatureStripeMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("user_resource_bundle_feature_stripe")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userResourceBundleFeatureId", "text", (col) => col.notNull())
			.addColumn("key", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"urbfs_[urbfId]_fk",
				[
					"userResourceBundleFeatureId",
				],
				"user_resource_bundle_feature",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("urbfs_[urbfId-key]_uniq", [
				"userResourceBundleFeatureId",
				"key",
			])
			.execute();

		await db.schema
			.createIndex("urbfs_[key]_idx")
			.on("user_resource_bundle_feature_stripe")
			.column("key")
			.execute();
	},
};
