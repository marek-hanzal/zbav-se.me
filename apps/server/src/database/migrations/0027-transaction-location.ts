import { type Migration, sql } from "kysely";

export const TransactionLocationMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("transaction_location")
			//
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("messageThreadId", "text", (col) => col.notNull())
			.addColumn("side", sql`transaction_side_enum`, (col) => col.notNull())
			//
			.addColumn("locationId", "text", (col) => col.notNull())
			.addColumn("time", "timestamp", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			//
			.addForeignKeyConstraint(
				"transaction_location_[messageThreadId]_fk",
				[
					"messageThreadId",
				],
				"transaction",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"transaction_location_[locationId]_fk",
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
			.createIndex("transaction_location_[messageThreadId]_idx")
			.on("transaction_location")
			.column("messageThreadId")
			.execute();

		await db.schema
			.createIndex("transaction_location_[locationId]_idx")
			.on("transaction_location")
			.column("locationId")
			.execute();
	},
};
