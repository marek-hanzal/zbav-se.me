import type { Migration } from "kysely";

export const ListingMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("listing")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("price", "decimal(10, 2)", (col) => col.notNull())
			.addColumn("currency", "text", (col) => col.notNull())
			.addColumn("condition", "integer", (col) => col.notNull())
			.addColumn("age", "integer", (col) => col.notNull())
			.addColumn("locationId", "text", (col) => col.notNull())
			.addColumn("categoryId", "text", (col) => col.notNull())
			.addColumn("expiresAt", "timestamp", (col) => col.notNull())
			.addColumn("createdAt", "timestamp", (col) =>
				col.notNull().defaultTo("now()"),
			)
			.addColumn("updatedAt", "timestamp", (col) =>
				col.notNull().defaultTo("now()"),
			)
			.addForeignKeyConstraint(
				"listing_[userId]_fk",
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
				"listing_[locationId]_fk",
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
				"listing_[categoryId]_fk",
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

		await db.schema
			.createIndex("listing_[userId]_idx")
			.on("listing")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("listing_[locationId]_idx")
			.on("listing")
			.column("locationId")
			.execute();

		await db.schema
			.createIndex("listing_[categoryId]_idx")
			.on("listing")
			.column("categoryId")
			.execute();

		await db.schema
			.createIndex("listing_[createdAt]_idx")
			.on("listing")
			.column("createdAt")
			.execute();

		await db.schema
			.createIndex("listing_[expiresAt]_idx")
			.on("listing")
			.column("expiresAt")
			.execute();
	},
};
