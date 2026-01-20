import { type Migration, sql } from "kysely";

export const ListingEventMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("listing_event_type_enum")
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
				"unignore",
				/**
				 * Flagged listing
				 */
				"flag",
				"unflag",
				/**
				 * Started transaction by buyer
				 */
				"transaction",
				"favourite",
				"unfavourite",
				/**
				 * Positive thumb on the listing
				 */
				"like",
				/**
				 * Negative thumb on the listing
				 */
				"dislike",
			])
			.execute();

		await db.schema
			.createTable("listing_event")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("event", sql`listing_event_type_enum`, (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"listing_event_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("listing_event_[listingId]_idx")
			.on("listing_event")
			.column("listingId")
			.execute();

		await db.schema
			.createIndex("listing_event_[event]_idx")
			.on("listing_event")
			.column("event")
			.execute();

		await db.schema
			.createIndex("listing_event_[createdAt]_idx")
			.on("listing_event")
			.column("createdAt")
			.execute();
	},
};
