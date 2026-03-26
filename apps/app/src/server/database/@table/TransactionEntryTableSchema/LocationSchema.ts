import { z } from "@hono/zod-openapi";
import { TransactionEntryKindEnumSchema } from "~/server/database/@enum/TransactionEntryKindEnumSchema";
import { EntrySchema } from "./EntrySchema";

export const LocationSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: TransactionEntryKindEnumSchema.extract([
			"location",
		]),
		payload: z
			.looseObject({
				locationId: z.string().openapi({
					description: "Location identifier linked to this entry",
				}),
			})
			.strip(),
	})
	.strip()
	.openapi("TransactionEntryLocation");
