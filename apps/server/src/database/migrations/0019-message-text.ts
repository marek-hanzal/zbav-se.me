import type { Migration } from "kysely";

export const MessageTextMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("message_text")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("messageThreadId", "text", (col) => col.notNull())
			//
			/**
			 * Payload
			 */
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("text", "text", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			//
			.addForeignKeyConstraint(
				"message_text_[userId]_fk",
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
				"message_text_[messageThreadId]_fk",
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
			.createIndex("message_text_[messageThreadId-createdAt]_idx")
			.on("message_text")
			.columns([
				"messageThreadId",
				"createdAt",
			])
			.execute();

		await db.schema
			.createIndex("message_text_[userId-createdAt]_idx")
			.on("message_text")
			.columns([
				"userId",
				"createdAt",
			])
			.execute();
	},
};
