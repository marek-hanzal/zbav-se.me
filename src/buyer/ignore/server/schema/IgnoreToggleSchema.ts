import { z } from "zod";
import { ListingMetaSchema } from "~/buyer/listing/server/schema/ListingMetaSchema";

export const IgnoreToggleSchema = z
	.looseObject({
		toggle: z.boolean().meta({
			description: "Whether to add (true) or remove (false) the listing from ignore list",
		}),
		listingId: z.string().meta({
			description: "ID of the listing to toggle",
		}),
		meta: ListingMetaSchema.optional(),
	})
	.strip()
	.meta({
		id: "IgnoreToggle",
		description: "Data for toggling a listing in ignore list",
	});

export type IgnoreToggleSchema = typeof IgnoreToggleSchema;

export namespace IgnoreToggleSchema {
	export type Type = z.infer<IgnoreToggleSchema>;
}
