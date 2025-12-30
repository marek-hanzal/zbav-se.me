import type { Migration } from "kysely";

export const MessageThreadUserMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("message_thread_user")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("messageThreadId", "text", (col) => col.notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamp", (col) => col.notNull())
			//
			.addForeignKeyConstraint(
				"message_thread_user_[messageThreadId]_fk",
				[
					"messageThreadId",
				],
				"message_thread",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"message_thread_user_[userId]_fk",
				[
					"userId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("message_thread_user_[messageThreadId-userId]_unique_idx", [
				"messageThreadId",
				"userId",
			])
			.execute();

		await db.schema
			.createIndex("message_thread_user_[messageThreadId]_idx")
			.on("message_thread_user")
			.column("messageThreadId")
			.execute();

		await db.schema
			.createIndex("message_thread_user_[userId]_idx")
			.on("message_thread_user")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("message_thread_user_[createdAt]_idx")
			.on("message_thread_user")
			.column("createdAt")
			.execute();

		await db.schema
			.createIndex("message_thread_user_[messageThreadId-userId]_idx")
			.on("message_thread_user")
			.columns([
				"messageThreadId",
				"userId",
			])
			.execute();
	},
};
