import type { Migration } from "kysely";

export const FavoriteMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("favorite")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("feedId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			.addForeignKeyConstraint(
				"favorite_[userId]_fk",
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
				"favorite_[feedId]_fk",
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
				"favorite_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("favorite_[userId-feedId-listingId]_unique_idx", [
				"userId",
				"feedId",
				"listingId",
			])
			.execute();

		await db.schema
			.createIndex("favorite_[userId]_idx")
			.on("favorite")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("favorite_[feedId]_idx")
			.on("favorite")
			.column("feedId")
			.execute();

		await db.schema
			.createIndex("favorite_[listingId]_idx")
			.on("favorite")
			.column("listingId")
			.execute();

		await db.schema
			.createIndex("favorite_[createdAt]_idx")
			.on("favorite")
			.column("createdAt")
			.execute();
	},
};
