import type { Migration } from "kysely/migration";

export const UserResourceBundleStripeMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("user_resource_bundle_stripe")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userResourceBundleId", "text", (col) => col.notNull())
			.addColumn("subscriptionId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"user_resource_bundle_stripe_[userResourceBundleId]_fk",
				[
					"userResourceBundleId",
				],
				"user_resource_bundle",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("user_resource_bundle_stripe_[userResourceBundleId]_unique_idx", [
				"userResourceBundleId",
			])
			.addUniqueConstraint("user_resource_bundle_stripe_[subscriptionId]_unique_idx", [
				"subscriptionId",
			])
			.execute();
	},
};
