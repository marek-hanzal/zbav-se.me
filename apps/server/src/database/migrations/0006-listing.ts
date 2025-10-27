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
				"listing_userId_fk",
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
				"listing_locationId_fk",
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
				"listing_categoryId_fk",
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
			.createIndex("listing_userId_idx")
			.on("listing")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("listing_locationId_idx")
			.on("listing")
			.column("locationId")
			.execute();

		await db.schema
			.createIndex("listing_categoryId_idx")
			.on("listing")
			.column("categoryId")
			.execute();

		await db.schema
			.createIndex("listing_createdAt_idx")
			.on("listing")
			.column("createdAt")
			.execute();

		await db.schema
			.createIndex("listing_expiresAt_idx")
			.on("listing")
			.column("expiresAt")
			.execute();
	},
};
