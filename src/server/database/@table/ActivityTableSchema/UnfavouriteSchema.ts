import { z } from "zod";
import { ActivitySchema } from "./ActivitySchema";

export const UnfavouriteSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: z.literal("reaction"),
		type: z.literal("unfavourite"),
		payload: z
			.looseObject({
				listingId: z.string().meta({
					description: "Related listing identifier",
				}),
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "ActivityUnfavourite",
		description: "Activity reaction event for unfavourite",
	});

export type UnfavouriteSchema = typeof UnfavouriteSchema;

export namespace UnfavouriteSchema {
	export type Type = z.infer<UnfavouriteSchema>;
}
