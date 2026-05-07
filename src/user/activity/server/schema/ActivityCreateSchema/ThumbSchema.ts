import { z } from "zod";
import { ThumbEnumSchema } from "~/common/listing/enum/ThumbEnumSchema";
import { ActivitySchema } from "./ActivitySchema";

export const ThumbSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: z.literal("reaction"),
		type: z.literal("thumb"),
		payload: z.looseObject({
			listingId: z.string().meta({
				description: "Listing identifier",
			}),
			thumb: ThumbEnumSchema,
		}),
	})
	.strip()
	.meta({
		id: "ActivityThumbCreate",
	});

export type ThumbSchema = typeof ThumbSchema;

export namespace ThumbSchema {
	export type Type = z.infer<ThumbSchema>;
}
