import { z } from "zod";
import { ActivitySchema } from "./ActivitySchema";

export const UnflagSchema = z
	.looseObject({
		...ActivitySchema.shape,
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
		id: "ActivityUnflagCreate",
	});
