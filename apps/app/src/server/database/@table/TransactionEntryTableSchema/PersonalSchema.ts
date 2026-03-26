import { z } from "@hono/zod-openapi";
import { TransactionEntryKindEnumSchema } from "~/server/database/@enum/TransactionEntryKindEnumSchema";
import { EntrySchema } from "./EntrySchema";

export const PersonalSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: TransactionEntryKindEnumSchema.extract([
			"personal",
		]),
		payload: z
			.looseObject({
				name: z.string().openapi({
					description: "Contact name",
				}),
				phone: z.string().openapi({
					description: "Contact phone",
				}),
				email: z.email().openapi({
					description: "Contact email",
				}),
				locationId: z.string().openapi({
					description: "Contact location identifier",
				}),
			})
			.strip(),
	})
	.strip()
	.openapi("TransactionEntryPersonal");
