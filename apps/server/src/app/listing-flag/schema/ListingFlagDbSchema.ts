import { z } from "@hono/zod-openapi";

export const ListingFlagDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the flag entry",
	}),
	userId: z.string().openapi({
		description: "ID of the user who flagged the listing",
	}),
	listingId: z.string().openapi({
		description: "ID of the listing",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type ListingFlagDbSchema = typeof ListingFlagDbSchema;

export namespace ListingFlagDbSchema {
	export type Type = z.infer<ListingFlagDbSchema>;
}
