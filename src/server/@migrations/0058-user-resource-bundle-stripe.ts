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
				"urbs_[urbId]_fk",
				[
					"userResourceBundleId",
				],
				"user_resource_bundle",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("urbs_[urbId]_uniq", [
				"userResourceBundleId",
			])
			.addUniqueConstraint("urbs_[subscriptionId]_uniq", [
				"subscriptionId",
			])
			.execute();
	},
};
