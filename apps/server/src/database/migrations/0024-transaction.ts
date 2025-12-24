import type { Migration } from "kysely";

export const TransactionMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("transaction_status_enum")
			.asEnum([
				// map to "pending"
				"request",
				//
				// map to "open"
				"accepted",
				// keep as is
				"rejected",
				// map to "completed"
				"success",
				// map to "cancelled"
				"closed",
				// keep as is
				"expired",
			])
			.execute();

		await db.schema
			.createType("transaction_side_enum")
			.asEnum([
				"seller",
				"buyer",
				"transaction",
				"system",
				"unknown",
			])
			.execute();

		await db.schema
			.createTable("transaction")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("messageThreadId", "text", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamp", (col) => col.notNull())
			.addColumn("updatedAt", "timestamp", (col) => col.notNull())
			.addColumn("expiresAt", "timestamp", (col) => col.notNull())
			//
			.addForeignKeyConstraint(
				"transaction_[userId]_fk",
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
				"transaction_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"transaction_[messageThreadId]_fk",
				[
					"messageThreadId",
				],
				"message_thread",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("transaction_[userId]_idx")
			.on("transaction")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("transaction_[listingId]_idx")
			.on("transaction")
			.column("listingId")
			.execute();

		await db.schema
			.createIndex("transaction_[messageThreadId]_idx")
			.on("transaction")
			.column("messageThreadId")
			.execute();

		await db.schema
			.createIndex("transaction_[createdAt]_idx")
			.on("transaction")
			.column("createdAt")
			.execute();

		await db.schema
			.createIndex("transaction_[updatedAt]_idx")
			.on("transaction")
			.column("updatedAt")
			.execute();
	},
};
