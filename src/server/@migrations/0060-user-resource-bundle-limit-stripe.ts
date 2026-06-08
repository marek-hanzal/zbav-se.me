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
				"urbls_[urblId]_fk",
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
				"urbls_[urblId-key]_uniq",
				[
					"userResourceBundleLimitId",
					"key",
				],
			)
			.execute();

		await db.schema
			.createIndex("urbls_[key]_idx")
			.on("user_resource_bundle_limit_stripe")
			.column("key")
			.execute();
	},
};
