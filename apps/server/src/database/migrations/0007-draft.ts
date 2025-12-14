import { type Migration, sql } from "kysely";

export const DraftMigration: Migration = {
	async up(db) {
		// Ensure pgvector extension (safe if already installed)
		await sql`CREATE EXTENSION IF NOT EXISTS vector;`.execute(db);

		await db.schema
			.createTable("draft")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			//
			.addColumn("price", "decimal(10, 2)")
			.addColumn("currency", "text")
			.addColumn("condition", "integer")
			.addColumn("age", "integer")
			.addColumn("locationId", "text")
			.addColumn("categoryId", "text")
			//
			.addColumn("title", "text")
			//
			.addColumn("description", "text")
			.addColumn("expiresAt", "timestamp")
			//
			.addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
			.addColumn("updatedAt", "timestamp", (col) => col.notNull().defaultTo("now()"))
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
			.execute();

		await db.schema.createIndex("draft_[userId]_idx").on("draft").column("userId").execute();

		await db.schema
			.createIndex("draft_[createdAt]_idx")
			.on("draft")
			.column("createdAt")
			.execute();

		await db.schema
			.createIndex("draft_[updatedAt]_idx")
			.on("draft")
			.column("updatedAt")
			.execute();

		await db.schema
			.createIndex("draft_[expiresAt]_idx")
			.on("draft")
			.column("expiresAt")
			.execute();
	},
};
