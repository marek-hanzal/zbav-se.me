import type { Migration } from "kysely/migration";

export const IgnoreMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("ignore")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"ignore_[userId]_fk",
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
				"ignore_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("ignore_[userId-listingId]_unique_idx", [
				"userId",
				"listingId",
			])
			.execute();

		await db.schema.createIndex("ignore_[userId]_idx").on("ignore").column("userId").execute();

		await db.schema
			.createIndex("ignore_[listingId]_idx")
			.on("ignore")
			.column("listingId")
			.execute();

		await db.schema
			.createIndex("ignore_[createdAt]_idx")
			.on("ignore")
			.column("createdAt")
			.execute();
	},
};
