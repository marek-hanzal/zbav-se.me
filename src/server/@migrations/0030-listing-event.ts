import { sql } from "kysely";
import type { Migration } from "kysely/migration";
import { toEnumGuard } from "@/lib/common/to-enum-guard";
import type { ListingEventEnumSchema } from "~/common/listing/enum/ListingEventEnumSchema";

export const ListingEventMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("listing_event_type_enum")
			.asEnum(
				toEnumGuard<ListingEventEnumSchema.Type>()([
					"impression",
					"view",
					"listing.ignore",
					"unignore",
					"listing.flag",
					"unflag",
					"transaction",
					"listing.favourite",
					"unfavourite",
					"like",
					"dislike",
				] as const),
			)
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
			.createIndex("listing_event_[listingId-createdAt]_idx")
			.on("listing_event")
			.columns([
				"listingId",
				"createdAt",
			])
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
