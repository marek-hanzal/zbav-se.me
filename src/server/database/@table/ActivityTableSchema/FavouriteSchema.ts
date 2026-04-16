import { z } from "zod";
import { ActivitySchema } from "./ActivitySchema";

export const FavouriteSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: z.literal("reaction"),
		type: z.literal("favourite"),
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
		id: "ActivityFavourite",
		description: "Activity reaction event for favourite",
	});

export type FavouriteSchema = typeof FavouriteSchema;

export namespace FavouriteSchema {
	export type Type = z.infer<FavouriteSchema>;
}
