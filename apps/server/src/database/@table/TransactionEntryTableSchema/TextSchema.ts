import { z } from "@hono/zod-openapi";
import { EntrySchema } from "./EntrySchema";

export const TextSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: z.literal("text"),
		payload: z.looseObject({
			text: z.string().openapi({
				description: "Text entry body",
			}),
		}),
	})
	.strip()
	.openapi("TransactionEntryText");
