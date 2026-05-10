import { sql } from "kysely";
import type { Migration } from "kysely/migration";
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
					"expired",
					"closed",
					"banned",
				]),
			)
			.execute();

		await db.schema
			.createTable("listing")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			//
			.addColumn("status", sql`listing_status_enum`, (col) => {
				return col.notNull();
			})
			//
			.addColumn("restriction", sql`restriction_enum`)
			//
			.addColumn("categoryId", "text", (col) => col.notNull())
			//
			.addColumn("galleryId", "text", (col) => col.notNull())
			.addColumn("withUploadIds", sql`text[]`, (col) => {
				return col.notNull().defaultTo(sql`array[]::text[]`);
			})
			.addColumn("withImageUrl", sql`text[]`, (col) => {
				return col.notNull().defaultTo(sql`array[]::text[]`);
			})

			/**
			 * Core listing fields (shared across all categories).
			 */
			.addColumn("title", "text", (col) => col.notNull())
			.addColumn("withTitle", "text", (col) => col.notNull())
			.addColumn("description", "text")
			//
			.addColumn("priceType", sql`price_type_enum`, (col) => col.notNull())
			.addColumn("price", "decimal(10, 2)", (col) => col.notNull())
			.addColumn("currency", "text")
			//
			.addColumn("expires", "text", (col) => col.notNull())
			//
			.addColumn("condition", "integer")
			.addColumn("age", "integer")
			//
			.addColumn("delivery", sql`delivery_enum[]`, (col) => {
				return col.notNull().defaultTo(sql`array[]::delivery_enum[]`);
			})
			.addColumn("warranty", sql`warranty_enum`)
			//
			.addColumn("locationId", "text", (col) => col.notNull())
			.addColumn("withLocation", sql`geography(Point,4326)`, (col) => col.notNull())
			//
			.addColumn("pros", sql`text[]`, (col) => {
				return col.notNull().defaultTo(sql`array[]::text[]`);
			})
			.addColumn("cons", sql`text[]`, (col) => {
				return col.notNull().defaultTo(sql`array[]::text[]`);
			})

			// createdAt = object creation, not market publish time.
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("updatedAt", "timestamptz", (col) => col.notNull())

			.addColumn("visibleAt", "timestamptz", (col) => col.notNull())
			.addColumn("expiresAt", "timestamptz", (col) => col.notNull())

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
				"listing_[categoryId]_fk",
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
				"listing_[galleryId]_fk",
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
				"listing_[locationId]_fk",
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
				"listing_[pros-cons-max]_check",
				sql`
                    cardinality("pros") <= 5
                    AND cardinality("cons") <= 5
                `,
			)
			.execute();

		/**
		 * Owner views.
		 */
		await sql`
			CREATE INDEX "listing_[userId-createdAt]_idx"
			ON "listing" ("userId", "createdAt" DESC, "id" DESC)
		`.execute(db);

		await sql`
			CREATE INDEX "listing_[userId-updatedAt]_idx"
			ON "listing" ("userId", "updatedAt" DESC, "id" DESC)
		`.execute(db);

		await sql`
			CREATE INDEX "listing_[userId-id]_live_idx"
			ON "listing" ("userId", "id")
			WHERE "status" = 'live'
		`.execute(db);

		/**
		 * FK / direct lookups.
		 */
		await db.schema
			.createIndex("listing_[categoryId]_idx")
			.on("listing")
			.column("categoryId")
			.execute();

		await db.schema
			.createIndex("listing_[galleryId]_idx")
			.on("listing")
			.column("galleryId")
			.execute();

		/**
		 * Admin/debug/status views.
		 */
		await db.schema
			.createIndex("listing_[status]_idx")
			.on("listing")
			.column("status")
			.execute();

		await sql`
            CREATE INDEX "listing_[title]_trgm_idx"
            ON "listing"
            USING gin ("withTitle" gin_trgm_ops)
        `.execute(db);

		/**
		 * Main feed/search shapes.
		 */
		await sql`
			CREATE INDEX "listing_[status-createdAt]_idx"
			ON "listing" ("status", "createdAt" DESC, "id" DESC)
		`.execute(db);

		await sql`
			CREATE INDEX "listing_[categoryId-visibleAt]_idx"
			ON "listing" ("categoryId", "visibleAt" DESC, "id" DESC)
		`.execute(db);

		await sql`
			CREATE INDEX "listing_[visibleAt]_idx"
			ON "listing" ("visibleAt" DESC, "id" DESC)
		`.execute(db);

		/**
		 * Expiration worker.
		 */
		await sql`
			CREATE INDEX "listing_[expiresAt]_idx"
			ON "listing" ("expiresAt")
		`.execute(db);

		await sql`
            CREATE INDEX "listing_[categoryId-price]_idx"
            ON "listing" ("categoryId", "price", "id")
            WHERE "price" IS NOT NULL
        `.execute(db);

		await sql`
            CREATE INDEX "listing_[withLocation]_idx"
            ON "listing"
            USING gist ("withLocation")
        `.execute(db);

		await sql`
            CREATE INDEX "listing_[delivery]_gin_idx"
            ON "listing"
            USING gin ("delivery")
        `.execute(db);
	},
};
