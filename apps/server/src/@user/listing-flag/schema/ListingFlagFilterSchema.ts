import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "../../../schema/DefaultFilterSchema";

export const ListingFlagFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().openapi({
			description: "This filter matches the exact listingId",
		}),
	})
	.openapi("ListingFlagFilter", {
		description: "Filter object for listing flag collection",
	});

export type ListingFlagFilterSchema = typeof ListingFlagFilterSchema;

export namespace ListingFlagFilterSchema {
	export type Type = z.infer<ListingFlagFilterSchema>;
}
