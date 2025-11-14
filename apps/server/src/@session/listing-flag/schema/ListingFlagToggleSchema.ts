import { z } from "@hono/zod-openapi";

export const ListingFlagToggleSchema = z
	.object({
		toggle: z.boolean().openapi({
			description: "Whether to add (true) or remove (false) the flag on the listing",
		}),
		listingId: z.string().openapi({
			description: "ID of the listing to toggle",
		}),
	})
	.openapi("ListingFlagToggle", {
		description: "Data for toggling a flag on a listing",
	});

export type ListingFlagToggleSchema = typeof ListingFlagToggleSchema;

export namespace ListingFlagToggleSchema {
	export type Type = z.infer<ListingFlagToggleSchema>;
}
