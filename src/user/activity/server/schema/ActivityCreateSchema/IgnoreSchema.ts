import { z } from "zod";
import { ActivitySchema } from "./ActivitySchema";

export const IgnoreSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: z.literal("reaction"),
		type: z.literal("ignore"),
		payload: z.looseObject({
			listingId: z.string().meta({
				description: "Related listing identifier",
			}),
		}),
	})
	.strip()
	.meta({
		id: "ActivityIgnoreCreate",
	});
