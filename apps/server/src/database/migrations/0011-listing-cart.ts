import type { Migration } from "kysely";

export const ListingCartMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("listing_cart")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamp", (col) =>
				col.notNull().defaultTo("now()"),
			)
			.addForeignKeyConstraint(
				"listing_cart_[userId]_fk",
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
				"listing_cart_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("listing_cart_[userId-listingId]_unique_idx", [
				"userId",
				"listingId",
			])
			.execute();

		await db.schema
			.createIndex("listing_cart_[userId]_idx")
			.on("listing_cart")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("listing_cart_[listingId]_idx")
			.on("listing_cart")
			.column("listingId")
			.execute();

		await db.schema
			.createIndex("listing_cart_[createdAt]_idx")
			.on("listing_cart")
			.column("createdAt")
			.execute();
	},
};
