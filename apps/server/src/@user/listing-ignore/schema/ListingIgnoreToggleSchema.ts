import { z } from "@hono/zod-openapi";

export const ListingIgnoreToggleSchema = z
	.object({
		toggle: z.boolean().openapi({
			description: "Whether to add (true) or remove (false) the listing from ignore list",
		}),
		listingId: z.string().openapi({
			description: "ID of the listing to toggle",
		}),
	})
	.openapi("ListingIgnoreToggle", {
		description: "Data for toggling a listing in ignore list",
	});

export type ListingIgnoreToggleSchema = typeof ListingIgnoreToggleSchema;

export namespace ListingIgnoreToggleSchema {
	export type Type = z.infer<ListingIgnoreToggleSchema>;
}
