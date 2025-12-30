import { type Migration, sql } from "kysely";

export const TransactionStatusMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("transaction_status")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("transactionId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("side", sql`transaction_side_enum`, (col) => col.notNull())
			//
			.addColumn("status", sql`transaction_status_enum`, (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamp", (col) => col.notNull())
			//
			.addForeignKeyConstraint(
				"transaction_status_[transactionId]_fk",
				[
					"transactionId",
				],
				"transaction",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"transaction_status_[listingId]_fk",
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
			.createIndex("transaction_status_[transactionId]_idx")
			.on("transaction_status")
			.column("transactionId")
			.execute();

		await db.schema
			.createIndex("transaction_status_[listingId]_idx")
			.on("transaction_status")
			.column("listingId")
			.execute();

		await db.schema
			.createIndex("transaction_status_[side]_idx")
			.on("transaction_status")
			.column("side")
			.execute();

		await db.schema
			.createIndex("transaction_status_[status]_idx")
			.on("transaction_status")
			.column("status")
			.execute();
	},
};
