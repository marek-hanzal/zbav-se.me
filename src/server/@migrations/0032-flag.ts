import type { Migration } from "kysely/migration";

export const FlagMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("listing_flag")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"listing_flag_[userId]_fk",
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
				"listing_flag_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("listing_flag_[userId-listingId]_unique_idx", [
				"userId",
				"listingId",
			])
			.execute();

		await db.schema
			.createIndex("listing_flag_[userId]_idx")
			.on("listing_flag")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("listing_flag_[listingId]_idx")
			.on("listing_flag")
			.column("listingId")
			.execute();

		await db.schema
			.createIndex("listing_flag_[createdAt]_idx")
			.on("listing_flag")
			.column("createdAt")
			.execute();
	},
};
