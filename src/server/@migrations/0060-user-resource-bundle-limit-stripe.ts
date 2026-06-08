import type { Migration } from "kysely/migration";

export const UserResourceBundleLimitStripeMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("user_resource_bundle_limit_stripe")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userResourceBundleLimitId", "text", (col) => col.notNull())
			.addColumn("key", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"urb_limit_stripe_[limit]_fk",
				[
					"userResourceBundleLimitId",
				],
				"user_resource_bundle_limit",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint(
				"urb_limit_stripe_[limit-key]_uniq",
				[
					"userResourceBundleLimitId",
					"key",
				],
			)
			.execute();

		await db.schema
			.createIndex("urb_limit_stripe_[key]_idx")
			.on("user_resource_bundle_limit_stripe")
			.column("key")
			.execute();
	},
};
