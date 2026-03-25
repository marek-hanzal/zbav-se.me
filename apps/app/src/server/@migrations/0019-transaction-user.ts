import { type Migration, sql } from "kysely";

export const TransactionUserMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("transaction_user")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("transactionId", "text", (col) => col.notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("side", sql`transaction_side_enum`, (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"transaction_user_[transactionId]_fk",
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
				"transaction_user_[userId]_fk",
				[
					"userId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("transaction_user_[transactionId-userId]_unique_idx", [
				"transactionId",
				"userId",
			])
			.execute();

		await db.schema
			.createIndex("transaction_user_[userId-createdAt]_idx")
			.on("transaction_user")
			.columns([
				"userId",
				"createdAt",
			])
			.execute();
	},
};
