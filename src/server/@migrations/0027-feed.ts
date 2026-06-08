import { sql } from "kysely";
import type { Migration } from "kysely/migration";
import { toEnumGuard } from "@/lib/common/to-enum-guard";
import type { FeedTypeEnumSchema } from "~/common/feed/enum/FeedTypeEnumSchema";

export const FeedMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("feed_type_enum")
			.asEnum(
				toEnumGuard<FeedTypeEnumSchema.Type>()([
					"user",
					"search",
				] as const),
			)
			.execute();

		await db.schema
			.createTable("feed")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("uploadId", "text")
			.addColumn("type", sql`feed_type_enum`, (col) => col.notNull())
			.addColumn("name", "text", (col) => col.notNull())
			.addColumn("query", "jsonb", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("updatedAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"feed_[userId]_fk",
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
				"feed_[uploadId]_fk",
				[
					"uploadId",
				],
				"upload",
				[
					"id",
				],
				(c) => c.onDelete("set null"),
			)
			.addUniqueConstraint("feed_[userId-name-type]_uniq", [
				"userId",
				"name",
				"type",
			])
			.execute();

		await db.schema.createIndex("feed_[userId]_idx").on("feed").column("userId").execute();
		await db.schema.createIndex("feed_[type]_idx").on("feed").column("type").execute();
		await db.schema
			.createIndex("feed_[userId-type]_idx")
			.on("feed")
			.columns([
				"userId",
				"type",
			])
			.execute();

		await db.schema
			.createIndex("feed_[updatedAt]_idx")
			.on("feed")
			.column("updatedAt")
			.execute();

		await sql`
			CREATE INDEX "feed_[userId-updatedAt]_idx"
			ON "feed" ("userId", "updatedAt" DESC);
		`.execute(db);

		await sql`
			CREATE INDEX "feed_[userId-createdAt]_idx"
			ON "feed" ("userId", "createdAt" DESC);
		`.execute(db);

		await db.schema.createIndex("feed_[uploadId]_idx").on("feed").column("uploadId").execute();
	},
};
