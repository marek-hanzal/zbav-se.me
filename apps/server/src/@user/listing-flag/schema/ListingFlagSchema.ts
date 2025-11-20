import { z } from "@hono/zod-openapi";
import { ListingFlagDbSchema } from "../../../app/listing-flag/schema/ListingFlagDbSchema";

export const ListingFlagSchema = z
	.object({
		...ListingFlagDbSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.openapi("ListingFlag", {
		description: "Listing flag data",
	});

export type ListingFlagSchema = typeof ListingFlagSchema;

export namespace ListingFlagSchema {
	export type Type = z.infer<ListingFlagSchema>;
}
