import { type Migration, sql } from "kysely";

export const ListingScoreMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("listing_score_type_enum")
			.asEnum([
				/**
				 * From feed, lowest weight
				 */
				"impression",
				/**
				 * Listing detail, medium weight
				 */
				"view",
				/**
				 * Explicit ignore of the listing
				 */
				"ignore",
				/**
				 * Flagged listing
				 */
				"flag",
				/**
				 * Started transaction by buyer
				 */
				"transaction",
				"favourite",
			])
			.execute();

		await db.schema
			.createTable("listing_score")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("score", "integer", (col) => col.notNull())
			.addColumn("type", sql`listing_score_type_enum`, (col) => col.notNull())
			.addColumn("createdAt", "timestamp", (col) => col.notNull())
			.addForeignKeyConstraint(
				"listing_score_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"listing_score_[userId]_fk",
				[
					"userId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("listing_score_[listingId]_idx")
			.on("listing_score")
			.column("listingId")
			.execute();

		await db.schema
			.createIndex("listing_score_[userId]_idx")
			.on("listing_score")
			.column("userId")
			.execute();

		await db.schema
			.createIndex("listing_score_[createdAt]_idx")
			.on("listing_score")
			.column("createdAt")
			.execute();
	},
};
