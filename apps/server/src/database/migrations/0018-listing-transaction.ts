import { type Migration, sql } from "kysely";

export const ListingTransactionMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("listing_transaction_event_enum")
			.asEnum([
				"status",
				"message",
				"gallery",
				"location",
			])
			.execute();

		await db.schema
			.createType("listing_transaction_status_enum")
			.asEnum([
				"request",
				"accepted",
				"rejected",
				"success",
				"closed",
				"expired",
			])
			.execute();

		await db.schema
			.createType("listing_transaction_side_enum")
			.asEnum([
				"seller",
				"buyer",
				"transaction",
				"system",
				"unknown",
			])
			.execute();

		await db.schema
			.createTable("listing_transaction")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			//
			.addColumn("status", sql`listing_transaction_status_enum`, (col) => col.notNull())
			.addColumn("side", sql`listing_transaction_side_enum`, (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			.addColumn("updatedAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			.addColumn("expiresAt", "timestamp", (col) => col.notNull())
			//
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
