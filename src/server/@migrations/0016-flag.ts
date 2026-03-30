import type { Migration } from "kysely";

export const FlagMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("flag")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"flag_[userId]_fk",
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
				"flag_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("flag_[userId-listingId]_unique_idx", [
				"userId",
				"listingId",
			])
			.execute();

		await db.schema.createIndex("flag_[userId]_idx").on("flag").column("userId").execute();

		await db.schema
			.createIndex("flag_[listingId]_idx")
			.on("flag")
			.column("listingId")
			.execute();

		await db.schema
			.createIndex("flag_[createdAt]_idx")
			.on("flag")
			.column("createdAt")
			.execute();
	},
};
