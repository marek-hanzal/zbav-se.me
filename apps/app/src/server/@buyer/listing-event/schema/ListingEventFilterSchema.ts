import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/common/schema/DefaultFilterSchema";

export const ListingEventFilterSchema = z
	.looseObject({
		...DefaultFilterSchema.shape,
		listingId: z.string().optional().openapi({
			description: "This filter matches the exact listingId",
		}),
	})
	.strip()
	.openapi("ListingEventFilter", {
		description: "Filter object for listing event collection",
	});

export type ListingEventFilterSchema = typeof ListingEventFilterSchema;

export namespace ListingEventFilterSchema {
	export type Type = z.infer<ListingEventFilterSchema>;
}
