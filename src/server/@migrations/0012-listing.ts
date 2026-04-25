import { type Migration, sql } from "kysely";
import { toEnumGuard } from "@/lib/common/to-enum-guard";
import type { ListingStatusEnumSchema } from "~/common/listing/enum/ListingStatusEnumSchema";

export const ListingMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("listing_status_enum")
			.asEnum(
				toEnumGuard<ListingStatusEnumSchema.Type>()([
					"live",
					"sold",
					"on-hold",
					"banned",
				]),
			)
			.execute();

		await db.schema
			.createTable("listing")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			//
			.addColumn("price", "decimal(10, 2)", (col) => col.notNull())
			.addColumn("priceType", sql`listing_price_enum`, (col) => col.notNull())
			.addColumn("currency", "text", (col) => col.notNull())
			.addColumn("condition", "integer")
			.addColumn("age", "integer")
			.addColumn("delivery", sql`listing_delivery_enum[]`)
			.addColumn("warranty", sql`listing_warranty_enum`)
			.addColumn("status", sql`listing_status_enum`)
			.addColumn("restriction", sql`restriction_enum`)
			.addColumn("locationId", "text", (col) => col.notNull())
			.addColumn("categoryId", "text", (col) => col.notNull())
			.addColumn("galleryId", "text", (col) => col.notNull())
			.addColumn("draftId", "text")
			//
			.addColumn("title", "text", (col) => col.notNull())
			.addColumn("titleVec", sql`vector(64)`)
			//
			.addColumn("description", "text")
			.addColumn("pros", sql`text[]`)
			.addColumn("cons", sql`text[]`)
			.addColumn("expiresAt", "timestamptz", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("updatedAt", "timestamptz", (col) => col.notNull())
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
			.addForeignKeyConstraint(
				"listing_[galleryId]_fk",
				[
					"galleryId",
				],
				"gallery",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"listing_[draftId]_fk",
				[
					"draftId",
				],
				"draft",
				[
					"id",
				],
				(c) => c.onDelete("set null"),
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
			.createIndex("listing_[categoryId-createdAt]_idx")
			.on("listing")
			.columns([
				"categoryId",
				"createdAt",
			])
			.execute();

		await db.schema
			.createIndex("listing_[locationId-categoryId-createdAt]_idx")
			.on("listing")
			.columns([
				"locationId",
				"categoryId",
				"createdAt",
			])
			.execute();

		await db.schema
			.createIndex("listing_[galleryId]_idx")
			.on("listing")
			.column("galleryId")
			.execute();

		await db.schema
			.createIndex("listing_[draftId]_idx")
			.on("listing")
			.column("draftId")
			.execute();

		await db.schema
			.createIndex("listing_[createdAt]_idx")
			.on("listing")
			.column("createdAt")
			.execute();

		await sql`
			CREATE INDEX "listing_[live-createdAt]_idx"
			ON "listing" ("createdAt" DESC)
			WHERE "status" = 'live'
		`.execute(db);

		await sql`
			CREATE INDEX "listing_[userId-createdAt]_idx"
			ON "listing" ("userId", "createdAt" DESC)
		`.execute(db);

		await sql`
			CREATE INDEX "listing_[userId-updatedAt]_idx"
			ON "listing" ("userId", "updatedAt" DESC)
		`.execute(db);

		await db.schema
			.createIndex("listing_[expiresAt]_idx")
			.on("listing")
			.column("expiresAt")
			.execute();

		await db.schema
			.createIndex("listing_[status]_idx")
			.on("listing")
			.column("status")
			.execute();

		await db.schema
			.createIndex("listing_[priceType]_idx")
			.on("listing")
			.column("priceType")
			.execute();

		await db.schema
			.createIndex("listing_[warranty]_idx")
			.on("listing")
			.column("warranty")
			.execute();

		await db.schema
			.createIndex("listing_[title]_trgm_idx")
			.on("listing")
			.using("gin")
			.expression(sql`lower(immutable_unaccent(title)) gin_trgm_ops`)
			.execute();

		// Title vector (e.g., simhash/char-ngrams): cosine
		await sql`
            CREATE INDEX "listing_[titleVec]_hnsw_cos_idx" ON "listing" USING hnsw ("titleVec" vector_cosine_ops);
        `.execute(db);
	},
};
