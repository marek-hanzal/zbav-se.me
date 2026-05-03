import { type Migration, sql } from "kysely";

export const DraftMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("draft")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			//
			.addColumn("restriction", sql`restriction_enum`)
			//
			.addColumn("categoryId", "text")
			//
			.addColumn("galleryId", "text", (col) => col.notNull())
			.addColumn("withUploadIds", sql`text[]`, (col) => {
				return col.notNull().defaultTo(sql`array[]::text[]`);
			})
			.addColumn("withImageUrl", sql`text[]`, (col) => {
				return col.notNull().defaultTo(sql`array[]::text[]`);
			})

			/**
			 * Core draft fields (shared across all categories).
			 */
			.addColumn("title", "text")
			.addColumn("description", "text")
			//
			.addColumn("price", "decimal(10, 2)", (col) => col.notNull())
			.addColumn("priceType", sql`price_type_enum`)
			.addColumn("currency", "text")
			//
			.addColumn("expires", "text")
			//
			.addColumn("condition", "integer")
			.addColumn("age", "integer")
			//
			.addColumn("delivery", sql`delivery_enum[]`, (col) => {
				return col.notNull().defaultTo(sql`array[]::delivery_enum[]`);
			})
			.addColumn("warranty", sql`warranty_enum`)
			//
			.addColumn("locationId", "text")
			.addColumn("withLocation", sql`geography(Point,4326)`)
			//
			.addColumn("pros", sql`text[]`, (col) => {
				return col.notNull().defaultTo(sql`array[]::text[]`);
			})
			.addColumn("cons", sql`text[]`, (col) => {
				return col.notNull().defaultTo(sql`array[]::text[]`);
			})

			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("updatedAt", "timestamptz", (col) => col.notNull())

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
				"draft_[categoryId]_fk",
				[
					"categoryId",
				],
				"category",
				[
					"id",
				],
				(c) => c.onDelete("restrict"),
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
				(c) => c.onDelete("restrict"),
			)
			.addForeignKeyConstraint(
				"draft_[locationId]_fk",
				[
					"locationId",
				],
				"location",
				[
					"id",
				],
				(c) => c.onDelete("restrict"),
			)

			.addCheckConstraint(
				"draft_[pros-cons-max]_check",
				sql`
                    cardinality("pros") <= 5
                    AND cardinality("cons") <= 5
                `,
			)
			.execute();

		await sql`
			CREATE INDEX "draft_[userId-createdAt]_idx"
			ON "draft" ("userId", "createdAt" DESC, "id" DESC)
		`.execute(db);

		await sql`
			CREATE INDEX "draft_[userId-updatedAt]_idx"
			ON "draft" ("userId", "updatedAt" DESC, "id" DESC)
		`.execute(db);

		await db.schema
			.createIndex("draft_[categoryId]_idx")
			.on("draft")
			.column("categoryId")
			.execute();

		await db.schema
			.createIndex("draft_[galleryId]_idx")
			.on("draft")
			.column("galleryId")
			.execute();
	},
};
