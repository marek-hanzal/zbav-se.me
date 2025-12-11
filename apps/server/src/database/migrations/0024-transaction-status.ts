import { type Migration, sql } from "kysely";

export const TransactionStatusMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("transaction_status")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("messageThreadId", "text", (col) => col.notNull())
			.addColumn("side", sql`transaction_side_enum`, (col) => col.notNull())
			//
			.addColumn("status", sql`transaction_status_enum`, (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			//
			.addForeignKeyConstraint(
				"transaction_status_[messageThreadId]_fk",
				[
					"messageThreadId",
				],
				"transaction",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("transaction_status_[messageThreadId]_idx")
			.on("transaction_status")
			.column("messageThreadId")
			.execute();
	},
};
