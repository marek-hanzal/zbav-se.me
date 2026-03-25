import { z } from "@hono/zod-openapi";
import { ThumbEnumSchema } from "~/server/database/@enum/ThumbEnumSchema";
import { InboxSchema } from "./InboxSchema";

export const ThumbSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("reaction"),
		type: z.literal("thumb"),
		payload: z.looseObject({
			listingId: z.string().openapi({
				description: "Listing identifier",
			}),
			thumb: ThumbEnumSchema,
		}),
	})
	.strip()
	.openapi("InboxThumb");
