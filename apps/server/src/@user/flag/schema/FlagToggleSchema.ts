import { z } from "@hono/zod-openapi";

export const FlagToggleSchema = z
	.object({
		toggle: z.boolean().openapi({
			description: "Whether to add (true) or remove (false) the flag on the listing",
		}),
		listingId: z.string().openapi({
			description: "ID of the listing to toggle",
		}),
	})
	.openapi("FlagToggle", {
		description: "Data for toggling a flag on a listing",
	});

export type FlagToggleSchema = typeof FlagToggleSchema;

export namespace FlagToggleSchema {
	export type Type = z.infer<FlagToggleSchema>;
}
