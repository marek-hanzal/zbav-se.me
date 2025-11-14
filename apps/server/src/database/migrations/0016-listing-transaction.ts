import type { Migration } from "kysely";

export const ListingTransactionMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("listing_transaction")
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			.addColumn("updatedAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			.addForeignKeyConstraint(
				"listing_transaction_[userId]_fk",
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
				"listing_transaction_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("listing_transaction_[userId]_idx")
			.on("listing_transaction")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("listing_transaction_[listingId]_idx")
			.on("listing_transaction")
			.column("listingId")
			.execute();

		await db.schema
			.createIndex("listing_transaction_[createdAt]_idx")
			.on("listing_transaction")
			.column("createdAt")
			.execute();

		await db.schema
			.createIndex("listing_transaction_[updatedAt]_idx")
			.on("listing_transaction")
			.column("updatedAt")
			.execute();
	},
};
