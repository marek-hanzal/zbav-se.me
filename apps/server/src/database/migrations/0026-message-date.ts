import type { Migration } from "kysely";

export const MessageDateMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("message_date")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("messageThreadId", "text", (col) => col.notNull())
			//
			/**
			 * Payload
			 */
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("datetime", "timestamp", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamp", (col) => col.notNull())
			//
			.addForeignKeyConstraint(
				"message_date_[userId]_fk",
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
				"message_date_[messageThreadId]_fk",
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
			.createIndex("message_date_[userId]_idx")
			.on("message_date")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("message_date_[messageThreadId]_idx")
			.on("message_date")
			.column("messageThreadId")
			.execute();

		await db.schema
			.createIndex("message_date_[createdAt]_idx")
			.on("message_date")
			.column("createdAt")
			.execute();
	},
};
