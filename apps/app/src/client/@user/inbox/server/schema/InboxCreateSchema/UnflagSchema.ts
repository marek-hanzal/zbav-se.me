import { z } from "zod";
import { InboxSchema } from "./InboxSchema";

export const UnflagSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("reaction"),
		type: z.literal("unflag"),
		payload: z.looseObject({
			listingId: z.string().meta({
				description: "Related listing identifier",
			}),
		}),
	})
	.strip()
	.meta({
		id: "InboxUnflagCreate",
	});
