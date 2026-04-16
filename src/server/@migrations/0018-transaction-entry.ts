import { type Migration, sql } from "kysely";
import { toEnumGuard } from "@/lib/common/to-enum-guard";
import type { TransactionEntryKindEnumSchema } from "~/common/user-transaction/enum/TransactionEntryKindEnumSchema";

export const TransactionEntryMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("transaction_entry_kind_enum")
			.asEnum(
				toEnumGuard<TransactionEntryKindEnumSchema.Type>()([
					"text",
					"gallery",
					"location",
					"package",
					"personal",
					"status-interest",
					"status-trade",
					"status-resolved",
					"status-dispute-buyer",
					"status-dispute-seller",
					"status-rejected-buyer",
					"status-rejected-seller",
					"status-sold",
					"status-expired",
					"status-success",
					"status-closed",
				] as const),
			)
			.execute();

		await db.schema
			.createTable("transaction_entry")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("transactionId", "text", (col) => col.notNull())
			.addColumn("kind", sql`transaction_entry_kind_enum`, (col) => col.notNull())
			.addColumn("userId", "text")
			.addColumn("payload", "jsonb", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"transaction_entry_[transactionId]_fk",
				[
					"transactionId",
				],
				"transaction",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"transaction_entry_[userId]_fk",
				[
					"userId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await sql`
			CREATE INDEX "transaction_entry_[transactionId-createdAt]_idx"
			ON "transaction_entry" ("transactionId", "createdAt" ASC, "id" ASC)
			INCLUDE ("kind", "userId", "payload")
		`.execute(db);

		await db.schema
			.createIndex("transaction_entry_[kind-createdAt]_idx")
			.on("transaction_entry")
			.columns([
				"kind",
				"createdAt",
			])
			.execute();
	},
};
