import { type Migration, sql } from "kysely";

export const FeedMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("feed")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("locationId", "text")
			.addColumn("uploadId", "text")
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
				"feed_[locationId]_fk",
				[
					"locationId",
				],
				"location",
				[
					"id",
				],
				(c) => c.onDelete("set null"),
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
			.addUniqueConstraint("feed_[userId-name]_unique_idx", [
				"userId",
				"name",
			])
			.execute();

		await db.schema.createIndex("feed_[userId]_idx").on("feed").column("userId").execute();

		await db.schema
			.createIndex("feed_[updatedAt]_idx")
			.on("feed")
			.column("updatedAt")
			.execute();

		await sql`
			CREATE INDEX "feed_[userId-updatedAt]_idx"
			ON "feed" ("userId", "updatedAt" DESC);
		`.execute(db);

		await db.schema
			.createIndex("feed_[locationId]_idx")
			.on("feed")
			.column("locationId")
			.execute();

		await db.schema.createIndex("feed_[uploadId]_idx").on("feed").column("uploadId").execute();
	},
};
