import { z } from "@hono/zod-openapi";
import { ListingSchema } from "~/@buyer/listing/schema/ListingSchema";

const DateTimeStringSchema = z.iso.datetime();

export const ListingMcpOutputSchema = z
	.object({
		...ListingSchema.shape,
		expiresAt: DateTimeStringSchema.openapi({
			description: "Listing expiration timestamp in ISO 8601 format.",
		}),
		createdAt: DateTimeStringSchema.openapi({
			description: "Listing creation timestamp in ISO 8601 format.",
		}),
		updatedAt: DateTimeStringSchema.openapi({
			description: "Listing last update timestamp in ISO 8601 format.",
		}),
	})
	.strip()
	.describe(
		"One buyer-visible listing formatted for MCP. Date fields are returned as ISO 8601 strings.",
	);

export type ListingMcpOutputSchema = typeof ListingMcpOutputSchema;

export namespace ListingMcpOutputSchema {
	export type Type = z.infer<ListingMcpOutputSchema>;
}

export const withListingMcpOutput = (listing: ListingSchema.Type): ListingMcpOutputSchema.Type => {
	return {
		...listing,
		expiresAt: listing.expiresAt.toISOString(),
		createdAt: listing.createdAt.toISOString(),
		updatedAt: listing.updatedAt.toISOString(),
	};
};
