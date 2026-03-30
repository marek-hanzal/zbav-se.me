import { z } from "zod";
import { InboxSchema } from "./InboxSchema";

export const FavouriteSchema = z
	.looseObject({
		...InboxSchema.shape,
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
		id: "InboxFavouriteCreate",
	});
