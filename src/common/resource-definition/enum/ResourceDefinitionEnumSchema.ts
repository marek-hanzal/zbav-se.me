import { z } from "zod";

export const ResourceDefinitionEnumSchema = z
	.enum([
		/**
		 * How many listing a user can created (include drafts)
		 */
		"listing.count",
		/**
		 * How many gallery items may a user attach to the listing (draft)
		 */
		"listing.gallery.count",
		/**
		 * How many feeds a user can have
		 */
		"feed.count",
		/**
		 * Those are token packages
		 */
		"item:token-small",
		"item:token-medium",
		"item:token-large",
	])
	.meta({
		id: "ResourceDefinitionEnum",
		description: "Supported resource definitions.",
	});

export type ResourceDefinitionEnumSchema = typeof ResourceDefinitionEnumSchema;

export namespace ResourceDefinitionEnumSchema {
	export type Type = z.infer<ResourceDefinitionEnumSchema>;
}
