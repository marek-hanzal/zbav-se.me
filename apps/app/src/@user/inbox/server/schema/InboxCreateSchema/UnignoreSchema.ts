import { z } from "zod";
import { InboxSchema } from "./InboxSchema";

export const UnignoreSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("reaction"),
		type: z.literal("unignore"),
		payload: z.looseObject({
			listingId: z.string().meta({
				description: "Related listing identifier",
			}),
		}),
	})
	.strip()
	.meta({
		id: "InboxUnignoreCreate",
	});
