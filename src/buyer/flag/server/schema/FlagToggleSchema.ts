import { z } from "zod";
import { ListingMetaSchema } from "~/buyer/listing/server/schema/ListingMetaSchema";

export const FlagToggleSchema = z
	.looseObject({
		toggle: z.boolean().meta({
			description: "Whether to add (true) or remove (false) the flag on the listing",
		}),
		listingId: z.string().meta({
			description: "ID of the listing to toggle",
		}),
		meta: ListingMetaSchema.optional(),
	})
	.strip()
	.meta({
		id: "FlagToggle",
		description: "Data for toggling a flag on a listing",
	});

export type FlagToggleSchema = typeof FlagToggleSchema;

export namespace FlagToggleSchema {
	export type Type = z.infer<FlagToggleSchema>;
}
