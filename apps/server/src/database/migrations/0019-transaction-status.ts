import { type Migration, sql } from "kysely";

export const TransactionStatusMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("transaction_status")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("transactionId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("side", sql`transaction_side_enum`, (col) => col.notNull())
			.addColumn("status", sql`transaction_status_enum`, (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
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
			.addForeignKeyConstraint(
				"transaction_status_[userId]_fk",
				[
					"userId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("transaction_status_[userId-createdAt]_idx")
			.on("transaction_status")
			.columns([
				"userId",
				"createdAt",
			])
			.execute();

		await sql`
			CREATE INDEX "transaction_status_[transactionId-createdAt]_idx"
			ON "transaction_status" ("transactionId", "createdAt" DESC, "id" DESC)
			INCLUDE ("status")
		`.execute(db);

		await db.schema
			.createIndex("transaction_status_[listingId-createdAt]_idx")
			.on("transaction_status")
			.columns([
				"listingId",
				"createdAt",
			])
			.execute();
	},
};
