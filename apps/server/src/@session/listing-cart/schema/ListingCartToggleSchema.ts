import { z } from "@hono/zod-openapi";

export const ListingCartToggleSchema = z
	.object({
		toggle: z.boolean().openapi({
			description:
				"Whether to add (true) or remove (false) the listing from cart",
		}),
		listingId: z.string().openapi({
			description: "ID of the listing to toggle",
		}),
	})
	.openapi("ListingCartToggle", {
		description: "Data for toggling a listing in cart",
	});

export type ListingCartToggleSchema = typeof ListingCartToggleSchema;

export namespace ListingCartToggleSchema {
	export type Type = z.infer<ListingCartToggleSchema>;
}
