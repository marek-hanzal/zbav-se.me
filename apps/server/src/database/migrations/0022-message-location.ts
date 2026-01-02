import type { Migration } from "kysely";

export const MessageLocationMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("message_location")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("messageThreadId", "text", (col) => col.notNull())
			//
			/**
			 * Payload
			 */
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("locationId", "text", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			//
			.addForeignKeyConstraint(
				"message_location_[userId]_fk",
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
				"message_location_[messageThreadId]_fk",
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
				"message_location_[locationId]_fk",
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
			.createIndex("message_location_[messageThreadId-createdAt]_idx")
			.on("message_location")
			.columns([
				"messageThreadId",
				"createdAt",
			])
			.execute();

		await db.schema
			.createIndex("message_location_[userId-createdAt]_idx")
			.on("message_location")
			.columns([
				"userId",
				"createdAt",
			])
			.execute();
	},
};
