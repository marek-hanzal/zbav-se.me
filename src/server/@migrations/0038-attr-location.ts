import type { Migration } from "kysely";
import { sql } from "kysely";

export const AttrLocationMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("attr_location")
			.addColumn("listingId", "text", (col) => col.notNull())
			.addColumn("fieldId", "text", (col) => col.notNull())
			.addColumn("locationId", "text", (col) => col.notNull())
			.addColumn("geo", sql`geography(Point, 4326)`, (col) => col.notNull())

			.addPrimaryKeyConstraint("attr_location_[listingId-fieldId]_pk", [
				"listingId",
				"fieldId",
			])

			.addForeignKeyConstraint(
				"attr_location_[listingId]_fk",
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
				"attr_location_[fieldId]_fk",
				[
					"fieldId",
				],
				"field",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"attr_location_[locationId]_fk",
				[
					"locationId",
				],
				"location",
				[
					"id",
				],
				(c) => c.onDelete("restrict"),
			)

			.execute();

		await db.schema
			.createIndex("attr_location_[fieldId-locationId-listingId]_idx")
			.on("attr_location")
			.columns([
				"fieldId",
				"locationId",
				"listingId",
			])
			.execute();

		await db.schema
			.createIndex("attr_location_[locationId]_idx")
			.on("attr_location")
			.column("locationId")
			.execute();

		await db.schema
			.createIndex("attr_location_[geo]_idx")
			.on("attr_location")
			.using("gist")
			.column("geo")
			.execute();
	},
};
