import { type Migration, sql } from "kysely";
import { toEnumGuard } from "@/lib/common/to-enum-guard";
import type { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import type { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import type { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";

export const DraftMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("listing_price_enum")
			.asEnum(
				toEnumGuard<ListingPriceEnumSchema.Type>()([
					"closed",
					"open",
					"offer",
				] as const),
			)
			.execute();

		await db.schema
			.createType("listing_delivery_enum")
			.asEnum(
				toEnumGuard<ListingDeliveryEnumSchema.Type>()([
					"personal",
					"post",
					"package",
					"other",
				] as const),
			)
			.execute();

		await db.schema
			.createType("listing_warranty_enum")
			.asEnum(
				toEnumGuard<ListingWarrantyEnumSchema.Type>()([
					"warranty",
					"no-warranty",
					"custom",
				] as const),
			)
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
			.addColumn("warranty", sql`listing_warranty_enum`)
			.addColumn("restriction", sql`restriction_enum`)
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
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("updatedAt", "timestamptz", (col) => col.notNull())
			.addColumn("usedAt", "timestamptz")
			.addColumn("withImageUrl", sql`text[]`, (col) =>
				col.notNull().defaultTo(sql`array[]::text[]`),
			)
			.addColumn("withUploadIds", sql`text[]`, (col) =>
				col.notNull().defaultTo(sql`array[]::text[]`),
			)
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
