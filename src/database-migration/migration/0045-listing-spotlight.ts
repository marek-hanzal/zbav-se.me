import { sql } from "kysely";
import type { Migration } from "kysely/migration";

export const ListingSpotlightMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("listing_spotlight")
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("text", "text", (col) => col.notNull())
			.addColumn("ranking", "integer", (col) => col.notNull())
			.addPrimaryKeyConstraint("listing_spotlight_[listingId-text-ranking]_pk", [
				"listingId",
				"text",
				"ranking",
			])
			.addForeignKeyConstraint(
				"listing_spotlight_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(builder) => builder.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("listing_spotlight_[listingId]_idx")
			.on("listing_spotlight")
			.column("listingId")
			.execute();

		await sql`
			CREATE INDEX "listing_spotlight_[text]_trgm_idx"
			ON "listing_spotlight"
			USING gin ("text" gin_trgm_ops)
		`.execute(db);
	},
};
