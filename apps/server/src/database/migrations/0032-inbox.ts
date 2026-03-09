import { type Migration, sql } from "kysely";
import type { InboxPriorityEnumSchema } from "~/database/@enum/InboxPriorityEnumSchema";
import type { InboxTypeEnumSchema } from "~/database/@enum/InboxTypeEnumSchema";

export const InboxMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("inbox_priority_enum")
			.asEnum([
				"common",
				"high",
			] as const satisfies readonly InboxPriorityEnumSchema.Type[])
			.execute();
		await db.schema
			.createType("inbox_type_enum")
			.asEnum([
				"seller-message",
				"buyer-message",
				"thumb",
				"favourite",
				"unfavourite",
			] as const satisfies readonly InboxTypeEnumSchema.Type[])
			.execute();

		await db.schema
			.createTable("inbox")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("timestamp", "timestamptz", (col) => col.notNull())
			.addColumn("family", "text", (col) => col.notNull())
			.addColumn("type", sql`inbox_type_enum`, (col) => col.notNull())
			.addColumn("payload", "jsonb", (col) => col.notNull())
			.addColumn("priority", sql`inbox_priority_enum`, (col) => col.notNull())
			.addColumn("archivedAt", "timestamptz")
			.addForeignKeyConstraint(
				"inbox_[userId]_fk",
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

		await db.schema.createIndex("inbox_[userId]_idx").on("inbox").column("userId").execute();

		await sql`
			CREATE INDEX "inbox_[userId-timestamp]_idx"
			ON "inbox" ("userId", "timestamp" DESC);
		`.execute(db);

		await db.schema
			.createIndex("inbox_[userId-priority]_idx")
			.on("inbox")
			.columns([
				"userId",
				"priority",
			])
			.execute();

		await db.schema
			.createIndex("inbox_[userId-family]_idx")
			.on("inbox")
			.columns([
				"userId",
				"family",
			])
			.execute();
	},
};
