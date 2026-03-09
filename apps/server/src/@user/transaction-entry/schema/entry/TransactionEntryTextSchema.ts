import { z } from "@hono/zod-openapi";
import { BaseEntrySchema } from "./BaseEntrySchema";

export const TransactionEntryTextSchema = z
	.looseObject({
		...BaseEntrySchema.shape,
		kind: z.literal("text"),
		payload: z.looseObject({
			text: z.string().openapi({
				description: "Text entry body",
			}),
		}),
	})
	.openapi("TransactionEntryText");
