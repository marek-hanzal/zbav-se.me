import type { Migration } from "kysely/migration";

export const FavouriteMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("listing_favourite")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("feedId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"listing_favourite_[userId]_fk",
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
				"listing_favourite_[feedId]_fk",
				[
					"feedId",
				],
				"feed",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"listing_favourite_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("listing_favourite_[userId-feedId-listingId]_uniq", [
				"userId",
				"feedId",
				"listingId",
			])
			.execute();

		await db.schema
			.createIndex("listing_favourite_[userId]_idx")
			.on("listing_favourite")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("listing_favourite_[feedId]_idx")
			.on("listing_favourite")
			.column("feedId")
			.execute();

		await db.schema
			.createIndex("listing_favourite_[listingId]_idx")
			.on("listing_favourite")
			.column("listingId")
			.execute();

		await db.schema
			.createIndex("listing_favourite_[userId-listingId]_idx")
			.on("listing_favourite")
			.columns([
				"userId",
				"listingId",
			])
			.execute();

		await db.schema
			.createIndex("listing_favourite_[createdAt]_idx")
			.on("listing_favourite")
			.column("createdAt")
			.execute();
	},
};
