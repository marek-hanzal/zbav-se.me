import { type Migration, sql } from "kysely";

export const DraftMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("draft")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("galleryId", "text", (col) => col.notNull())

			.addColumn("payload", "jsonb", (col) => col.notNull().defaultTo(sql`'{}'::jsonb`))

			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("updatedAt", "timestamptz", (col) => col.notNull())
			.addColumn("usedAt", "timestamptz")

			.addColumn("withImageUrl", sql`text[]`, (col) => {
				return col.notNull().defaultTo(sql`array[]::text[]`);
			})
			.addColumn("withUploadIds", sql`text[]`, (col) => {
				return col.notNull().defaultTo(sql`array[]::text[]`);
			})

			.addForeignKeyConstraint(
				"draft_[userId]_fk",
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
				"draft_[galleryId]_fk",
				[
					"galleryId",
				],
				"gallery",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)

			.execute();

		await db.schema.createIndex("draft_[userId]_idx").on("draft").column("userId").execute();

		await db.schema.createIndex("draft_[usedAt]_idx").on("draft").column("usedAt").execute();

		await sql`
			CREATE INDEX "draft_[userId-createdAt]_idx"
			ON "draft" ("userId", "createdAt" ASC);
		`.execute(db);

		await sql`
			CREATE INDEX "draft_[userId-updatedAt]_idx"
			ON "draft" ("userId", "updatedAt" ASC);
		`.execute(db);

		await sql`
			CREATE INDEX "draft_[userId-updatedAt]_usedAt-null_idx"
			ON "draft" ("userId", "updatedAt" DESC)
			WHERE "usedAt" IS NULL;
		`.execute(db);
	},
};
