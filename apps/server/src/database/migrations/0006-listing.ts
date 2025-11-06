import { type Migration, sql } from "kysely";

export const ListingMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("listing")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			//
			.addColumn("price", "decimal(10, 2)", (col) => col.notNull())
			.addColumn("currency", "text", (col) => col.notNull())
			.addColumn("condition", "integer", (col) => col.notNull())
			.addColumn("age", "integer", (col) => col.notNull())
			.addColumn("locationId", "text", (col) => col.notNull())
			.addColumn("categoryId", "text", (col) => col.notNull())
			.addColumn("title", "text", (col) => col.notNull())
			.addColumn("description", "text")
			.addColumn("expiresAt", "timestamp", (col) => col.notNull())
			.addColumn("embedding", sql`vector(256)`, (col) => col.notNull())
			//
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

		await db.schema
			.createIndex("listing_[title]_btree_idx")
			.on("listing")
			.using("btree")
			.expression(sql`lower(title) text_pattern_ops`)
			.execute();

		await db.schema
			.createIndex("listing_[title]_trgm_idx")
			.on("listing")
			.using("gin")
			.expression(sql`lower(title) gin_trgm_ops`)
			.execute();

		await sql`
                CREATE INDEX "listing_[embedding]_hnsw_cos_idx" ON "listing" USING hnsw ("embedding" vector_cosine_ops)
              `.execute(db);
	},
};
