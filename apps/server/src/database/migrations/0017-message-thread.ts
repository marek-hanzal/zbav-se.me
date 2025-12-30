import type { Migration } from "kysely";

export const MessageThreadMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("message_thread")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("createdAt", "timestamp", (col) => col.notNull())
			.addColumn("updatedAt", "timestamp", (col) => col.notNull())
			.execute();

		await db.schema
			.createIndex("message_thread_[updatedAt]_idx")
			.on("message_thread")
			.column("updatedAt")
			.execute();
	},
};
