import type { Migration } from "kysely";

export const MessagePackageMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("message_package")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("messageThreadId", "text", (col) => col.notNull())
			//
			/**
			 * Payload
			 */
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("link", "text", (col) => col.notNull())
			.addColumn("number", "text")
			//
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			//
			.addForeignKeyConstraint(
				"message_package_[userId]_fk",
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
				"message_package_[messageThreadId]_fk",
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
			.createIndex("message_package_[userId]_idx")
			.on("message_package")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("message_package_[messageThreadId]_idx")
			.on("message_package")
			.column("messageThreadId")
			.execute();

		await db.schema
			.createIndex("message_package_[createdAt]_idx")
			.on("message_package")
			.column("createdAt")
			.execute();

		await db.schema
			.createIndex("message_package_[messageThreadId-createdAt]_idx")
			.on("message_package")
			.columns([
				"messageThreadId",
				"createdAt",
			])
			.execute();

		await db.schema
			.createIndex("message_package_[userId-createdAt]_idx")
			.on("message_package")
			.columns([
				"userId",
				"createdAt",
			])
			.execute();
	},
};
