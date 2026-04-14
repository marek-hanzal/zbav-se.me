import { type Migration, sql } from "kysely";
import { toEnumGuard } from "@/lib/common/to-enum-guard";
import type { ActivityPriorityEnumSchema } from "~/common/activity/enum/ActivityPriorityEnumSchema";
import type { ActivityTypeEnumSchema } from "~/common/activity/enum/ActivityTypeEnumSchema";

export const ActivityMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("activity_priority_enum")
			.asEnum(
				toEnumGuard<ActivityPriorityEnumSchema.Type>()([
					"common",
					"high",
				] as const),
			)
			.execute();
		await db.schema
			.createType("activity_type_enum")
			.asEnum(
				toEnumGuard<ActivityTypeEnumSchema.Type>()([
					"buyer-message",
					"seller-message",
					"transaction",
					"system",
					"unknown",
					"thumb",
					"favourite",
					"unfavourite",
					"flag",
					"unflag",
					"ignore",
					"unignore",
				] as const),
			)
			.execute();

		await db.schema
			.createTable("activity")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("reference", sql`text[]`, (col) =>
				col.defaultTo(sql`'{}'::text[]`).notNull(),
			)
			.addColumn("timestamp", "timestamptz", (col) => col.notNull())
			.addColumn("family", "text", (col) => col.notNull())
			.addColumn("type", sql`activity_type_enum`, (col) => col.notNull())
			.addColumn("payload", "jsonb", (col) => col.notNull())
			.addColumn("priority", sql`activity_priority_enum`, (col) => col.notNull())
			.addColumn("archivedAt", "timestamptz")
			.addForeignKeyConstraint(
				"activity_[userId]_fk",
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

		await db.schema
			.createIndex("activity_[userId]_idx")
			.on("activity")
			.column("userId")
			.execute();

		await sql`
			CREATE INDEX "activity_[userId-timestamp]_idx"
			ON "activity" ("userId", "timestamp" DESC);
		`.execute(db);

		await db.schema
			.createIndex("activity_[userId-priority]_idx")
			.on("activity")
			.columns([
				"userId",
				"priority",
			])
			.execute();

		await db.schema
			.createIndex("activity_[userId-family]_idx")
			.on("activity")
			.columns([
				"userId",
				"family",
			])
			.execute();

		await sql`
			CREATE INDEX "activity_[reference]_idx"
			ON "activity"
			USING GIN ("reference");
		`.execute(db);
	},
};
