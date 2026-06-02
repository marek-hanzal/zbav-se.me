import type { Migration } from "kysely/migration";

export const IgnoreMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("listing_ignore")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"listing_ignore_[userId]_fk",
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
				"listing_ignore_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("listing_ignore_[userId-listingId]_unique_idx", [
				"userId",
				"listingId",
			])
			.execute();

		await db.schema
			.createIndex("listing_ignore_[userId]_idx")
			.on("listing_ignore")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("listing_ignore_[listingId]_idx")
			.on("listing_ignore")
			.column("listingId")
			.execute();

		await db.schema
			.createIndex("listing_ignore_[createdAt]_idx")
			.on("listing_ignore")
			.column("createdAt")
			.execute();
	},
};
