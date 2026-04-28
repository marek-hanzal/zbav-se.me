import { type Migration, sql } from "kysely";
import { toEnumGuard } from "@/lib/common/to-enum-guard";
import type { ListingStatusEnumSchema } from "~/common/listing/enum/ListingStatusEnumSchema";

export const ListingMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("listing_status_enum")
			.asEnum(
				toEnumGuard<ListingStatusEnumSchema.Type>()([
					"draft",
					"live",
					"sold",
					"on-hold",
					"expired",
					"closed",
					"banned",
				] as const),
			)
			.execute();

		await db.schema
			.createTable("listing")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())

			// Workflow / gate.
			.addColumn("status", sql`listing_status_enum`, (col) => {
				return col.notNull();
			})
			.addColumn("restriction", sql`restriction_enum`)

			// Category can be missing while draft.
			// Published states must have it.
			.addColumn("categoryId", "text", (col) => col.notNull())

			// Media aggregate.
			// Listing can start with empty gallery; publish validates actual image count.
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
			.addColumn("title", "text")
			.addColumn("withTitle", "text")
			.addColumn("description", "text")
			//
			.addColumn("price", "decimal(10, 2)")
			.addColumn("priceType", sql`listing_price_enum`)
			.addColumn("currency", "text")
			//
			.addColumn("condition", "integer")
			.addColumn("age", "integer")
			//
			.addColumn("delivery", sql`listing_delivery_enum[]`)
			.addColumn("warranty", sql`listing_warranty_enum`)
			//
			.addColumn("locationId", "text")
			.addColumn("withLocationGeo", sql`geography(Point,4326)`)
			//
			.addColumn("pros", sql`text[]`)
			.addColumn("cons", sql`text[]`)

			// createdAt = object creation, not market publish time.
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("updatedAt", "timestamptz", (col) => col.notNull())

			// Public lifecycle. Null while draft.
			.addColumn("visibleAt", "timestamptz")
			.addColumn("expiresAt", "timestamptz")

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

			// Draft is private/unpublished.
			.addCheckConstraint(
				"listing_[draft-lifecycle-null]_check",
				sql`
					"status" <> 'draft'
					OR (
						"visibleAt" IS NULL
						AND "expiresAt" IS NULL
					)
				`,
			)

			// Published-ish states must have public lifecycle and category data.
			// banned is intentionally excluded: admin hard stop can apply to weird states too.
			.addCheckConstraint(
				"listing_[published-required]_check",
				sql`
					"status" NOT IN ('live', 'sold', 'on-hold', 'expired', 'closed')
					OR (
						"categoryId" IS NOT NULL
						AND "visibleAt" IS NOT NULL
						AND "expiresAt" IS NOT NULL
					)
				`,
			)

			// If public lifecycle exists, keep it sane.
			.addCheckConstraint(
				"listing_[lifecycle-order]_check",
				sql`
					(
						"visibleAt" IS NULL
						AND "expiresAt" IS NULL
					)
					OR (
						"visibleAt" IS NOT NULL
						AND "expiresAt" IS NOT NULL
						AND "visibleAt" < "expiresAt"
					)
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
			CREATE INDEX "listing_[userId-updatedAt]_draft_idx"
			ON "listing" ("userId", "updatedAt" DESC, "id" DESC)
			WHERE "status" = 'draft'
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

		/**
		 * Main feed/search shapes.
		 */
		await sql`
			CREATE INDEX "listing_[live-categoryId-visibleAt]_idx"
			ON "listing" ("categoryId", "visibleAt" DESC, "id" DESC)
			WHERE "status" = 'live'
		`.execute(db);

		await sql`
			CREATE INDEX "listing_[live-visibleAt]_idx"
			ON "listing" ("visibleAt" DESC, "id" DESC)
			WHERE "status" = 'live'
		`.execute(db);

		/**
		 * Expiration worker.
		 */
		await sql`
			CREATE INDEX "listing_[live-expiresAt]_idx"
			ON "listing" ("expiresAt")
			WHERE "status" = 'live'
		`.execute(db);
	},
};
