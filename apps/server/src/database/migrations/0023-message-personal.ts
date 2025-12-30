import type { Migration } from "kysely";

export const MessagePersonalMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("message_personal")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("messageThreadId", "text", (col) => col.notNull())
			//
			/**
			 * Payload
			 */
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("name", "text", (col) => col.notNull())
			.addColumn("phone", "text", (col) => col.notNull())
			.addColumn("email", "text", (col) => col.notNull())
			// (Home) Address or whatever, used to send a package if needed
			.addColumn("locationId", "text", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			//
			.addForeignKeyConstraint(
				"message_personal_[userId]_fk",
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
				"message_personal_[messageThreadId]_fk",
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
				"message_personal_[locationId]_fk",
				[
					"locationId",
				],
				"location",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("message_personal_[userId]_idx")
			.on("message_personal")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("message_personal_[messageThreadId]_idx")
			.on("message_personal")
			.column("messageThreadId")
			.execute();

		await db.schema
			.createIndex("message_personal_[locationId]_idx")
			.on("message_personal")
			.column("locationId")
			.execute();

		await db.schema
			.createIndex("message_personal_[createdAt]_idx")
			.on("message_personal")
			.column("createdAt")
			.execute();

		await db.schema
			.createIndex("message_personal_[messageThreadId-createdAt]_idx")
			.on("message_personal")
			.columns([
				"messageThreadId",
				"createdAt",
			])
			.execute();

		await db.schema
			.createIndex("message_personal_[userId-createdAt]_idx")
			.on("message_personal")
			.columns([
				"userId",
				"createdAt",
			])
			.execute();
	},
};
