import { type Migration, sql } from "kysely";
import { toEnumGuard } from "@/lib/common/to-enum-guard";
import type { ThumbEnumSchema } from "~/common/listing/enum/ThumbEnumSchema";

export const ThumbMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("thumb_enum")
			.asEnum(
				toEnumGuard<ThumbEnumSchema.Type>()([
					"like",
					"dislike",
				] as const),
			)
			.execute();

		await db.schema
			.createTable("thumb")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("type", sql`thumb_enum`, (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addForeignKeyConstraint(
				"thumb_[userId]_fk",
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
				"thumb_[listingId]_fk",
				[
					"listingId",
				],
				"listing",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("thumb_[userId-listingId]_unique_idx", [
				"userId",
				"listingId",
			])
			.execute();

		await db.schema
			.createIndex("thumb_[listingId-type]_idx")
			.on("thumb")
			.columns([
				"listingId",
				"type",
			])
			.execute();

		await db.schema
			.createIndex("thumb_[userId-createdAt]_idx")
			.on("thumb")
			.columns([
				"userId",
				"createdAt",
			])
			.execute();
	},
};
