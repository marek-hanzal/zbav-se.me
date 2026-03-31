import { z } from "zod";
import { InboxSchema } from "./InboxSchema";

export const UnfavouriteSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("reaction"),
		type: z.literal("unfavourite"),
		payload: z.looseObject({
			listingId: z.string().meta({
				description: "Related listing identifier",
			}),
		}),
	})
	.strip()
	.meta({
		id: "InboxUnfavouriteCreate",
	});
