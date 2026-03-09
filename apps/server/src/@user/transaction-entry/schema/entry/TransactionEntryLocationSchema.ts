import { z } from "@hono/zod-openapi";
import { BaseEntrySchema } from "./BaseEntrySchema";

export const TransactionEntryLocationSchema = z
	.looseObject({
		...BaseEntrySchema.shape,
		kind: z.literal("location"),
		payload: z.looseObject({
			locationId: z.string().openapi({
				description: "Location identifier linked to this entry",
			}),
		}),
	})
	.openapi("TransactionEntryLocation");
