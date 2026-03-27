import { z } from "zod";
import { ThumbEnumSchema } from "~/common/listing/enum/ThumbEnumSchema";
import { InboxSchema } from "./InboxSchema";

export const ThumbSchema = z
	.looseObject({
		...InboxSchema.shape,
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
		id: "InboxThumbCreate",
	});

export type ThumbSchema = typeof ThumbSchema;

export namespace ThumbSchema {
	export type Type = z.infer<ThumbSchema>;
}
