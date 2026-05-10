import type { Migration } from "kysely/migration";

export const FavouriteMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("favourite")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("feedId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"favourite_[userId]_fk",
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
				"favourite_[feedId]_fk",
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
				"favourite_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("favourite_[userId-feedId-listingId]_unique_idx", [
				"userId",
				"feedId",
				"listingId",
			])
			.execute();

		await db.schema
			.createIndex("favourite_[userId]_idx")
			.on("favourite")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("favourite_[feedId]_idx")
			.on("favourite")
			.column("feedId")
			.execute();

		await db.schema
			.createIndex("favourite_[listingId]_idx")
			.on("favourite")
			.column("listingId")
			.execute();

		await db.schema
			.createIndex("favourite_[userId-listingId]_idx")
			.on("favourite")
			.columns([
				"userId",
				"listingId",
			])
			.execute();

		await db.schema
			.createIndex("favourite_[createdAt]_idx")
			.on("favourite")
			.column("createdAt")
			.execute();
	},
};
