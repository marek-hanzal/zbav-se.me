import { z } from "@hono/zod-openapi";

export const ListingEventEnumSchema = z
	.enum([
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
		 * Positive feedback on the listing
		 */
		"like",
		/**
		 * Negative feedback on the listing
		 */
		"dislike",
	])
	.openapi("ListingEventEnum", {
		description: "Type of listing event",
	});

export type ListingEventEnumSchema = typeof ListingEventEnumSchema;

export namespace ListingEventEnumSchema {
	export type Type = z.infer<ListingEventEnumSchema>;
}
