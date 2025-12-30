import type { Migration } from "kysely";

export const MessageSystemMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("message_system")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("messageThreadId", "text", (col) => col.notNull())
			//
			/**
			 * Payload
			 */
			.addColumn("text", "text", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			//
			.addForeignKeyConstraint(
				"message_system_[messageThreadId]_fk",
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
			.createIndex("message_system_[messageThreadId-createdAt]_idx")
			.on("message_system")
			.columns([
				"messageThreadId",
				"createdAt",
			])
			.execute();
	},
};
