import { z } from "@hono/zod-openapi";

export const ListingDeliveryEnumSchema = z
	.enum([
		"personal",
		"post",
		"package",
		"other",
	])
	.openapi("ListingDeliveryEnum", {
		description: "Delivery method for the listing",
	});

export type ListingDeliveryEnumSchema = typeof ListingDeliveryEnumSchema;

export namespace ListingDeliveryEnumSchema {
	export type Type = z.infer<ListingDeliveryEnumSchema>;
}
