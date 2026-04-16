import { z } from "zod";
import { ActivitySchema } from "./ActivitySchema";

export const FavouriteSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: z.literal("reaction"),
		type: z.literal("favourite"),
		payload: z.looseObject({
			listingId: z.string().meta({
				description: "Related listing identifier",
			}),
		}),
	})
	.strip()
	.meta({
		id: "ActivityFavouriteCreate",
	});
