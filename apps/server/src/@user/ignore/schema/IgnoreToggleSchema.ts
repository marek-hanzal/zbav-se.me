import { z } from "@hono/zod-openapi";

export const IgnoreToggleSchema = z
	.object({
		toggle: z.boolean().openapi({
			description: "Whether to add (true) or remove (false) the listing from ignore list",
		}),
		listingId: z.string().openapi({
			description: "ID of the listing to toggle",
		}),
	})
	.openapi("IgnoreToggle", {
		description: "Data for toggling a listing in ignore list",
	});

export type IgnoreToggleSchema = typeof IgnoreToggleSchema;

export namespace IgnoreToggleSchema {
	export type Type = z.infer<IgnoreToggleSchema>;
}
