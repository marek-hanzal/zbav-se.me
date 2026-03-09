import type { Migration } from "kysely";

export const TransactionMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("transaction_status_enum")
			.asEnum([
				"pending",
				"open",
				"resolved",
				"dispute",
				"rejected",
				"expired",
				"success",
				"closed",
			])
			.execute();

		await db.schema
			.createType("transaction_side_enum")
			.asEnum([
				"seller",
				"buyer",
				"transaction",
				"system",
				"unknown",
			])
			.execute();

		await db.schema
			.createTable("transaction")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("updatedAt", "timestamptz", (col) => col.notNull())
			.addColumn("expiresAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"transaction_[userId]_fk",
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
				"transaction_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("transaction_[userId-createdAt]_idx")
			.on("transaction")
			.columns([
				"userId",
				"createdAt",
			])
			.execute();

		await db.schema
			.createIndex("transaction_[listingId-createdAt]_idx")
			.on("transaction")
			.columns([
				"listingId",
				"createdAt",
			])
			.execute();

		await db.schema
			.createIndex("transaction_[expiresAt]_idx")
			.on("transaction")
			.column("expiresAt")
			.execute();
	},
};
