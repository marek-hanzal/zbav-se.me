import type { Migration } from "kysely/migration";

export const UserResourceBundleMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("user_resource_bundle")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("resourceBundleId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("availableAt", "timestamptz", (col) => col.notNull())
			.addColumn("expiresAt", "timestamptz")
			.addForeignKeyConstraint(
				"urb_[userId]_fk",
				[
					"userId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"urb_[rbId]_fk",
				[
					"resourceBundleId",
				],
				"resource_bundle",
				[
					"id",
				],
			)
			.execute();

		await db.schema
			.createIndex("urb_[userId-availableAt]_idx")
			.on("user_resource_bundle")
			.columns([
				"userId",
				"availableAt",
			])
			.execute();

		await db.schema
			.createIndex("urb_[rbId]_idx")
			.on("user_resource_bundle")
			.column("resourceBundleId")
			.execute();

		await db.schema
			.createIndex("urb_[userId-createdAt]_idx")
			.on("user_resource_bundle")
			.columns([
				"userId",
				"createdAt",
			])
			.execute();
	},
};
