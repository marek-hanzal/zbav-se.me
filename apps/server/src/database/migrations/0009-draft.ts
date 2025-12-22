import { type Migration, sql } from "kysely";

export const DraftMigration: Migration = {
	async up(db) {
		// Ensure pgvector extension (safe if already installed)
		await sql`CREATE EXTENSION IF NOT EXISTS vector;`.execute(db);

		await db.schema
			.createType("listing_price_enum")
			.asEnum([
				"closed",
				"open",
			])
			.execute();

		await db.schema
			.createType("listing_delivery_enum")
			.asEnum([
				"personal",
				"post",
				"package",
				"other",
			])
			.execute();

		await db.schema
			.createTable("draft")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			//
			.addColumn("price", "decimal(10, 2)")
			.addColumn("priceType", sql`listing_price_enum`)
			.addColumn("currency", "text")
			.addColumn("condition", "integer")
			.addColumn("age", "integer")
			.addColumn("delivery", sql`listing_delivery_enum[]`)
			.addColumn("locationId", "text")
			.addColumn("categoryId", "text")
			.addColumn("galleryId", "text", (col) => col.notNull())
			//
			.addColumn("title", "text")
			//
			.addColumn("description", "text")
			.addColumn("pros", sql`text[]`)
			.addColumn("cons", sql`text[]`)
			.addColumn("expiresAt", "text")
			//
			.addColumn("createdAt", "timestamp", (col) => col.notNull())
			.addColumn("updatedAt", "timestamp", (col) => col.notNull())
			.addColumn("usedAt", "timestamp")
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
				"draft_[locationId]_fk",
				[
					"locationId",
				],
				"location",
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
	},
};
