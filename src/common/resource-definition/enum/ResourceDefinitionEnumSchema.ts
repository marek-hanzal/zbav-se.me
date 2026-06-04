import { z } from "zod";

export const ResourceDefinitionEnumSchema = z
	.enum([
		"listing.count",
		"feed.count",
		"listing.gallery.count",
		"item:token-150",
	])
	.meta({
		id: "ResourceDefinitionEnum",
		description: "Supported resource definitions.",
	});

export type ResourceDefinitionEnumSchema = typeof ResourceDefinitionEnumSchema;

export namespace ResourceDefinitionEnumSchema {
	export type Type = z.infer<ResourceDefinitionEnumSchema>;
}
