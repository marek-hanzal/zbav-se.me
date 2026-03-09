import { z } from "@hono/zod-openapi";
import { BaseEntrySchema } from "./BaseEntrySchema";

export const TransactionEntryPersonalSchema = z
	.looseObject({
		...BaseEntrySchema.shape,
		kind: z.literal("personal"),
		payload: z.looseObject({
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
		}),
	})
	.openapi("TransactionEntryPersonal");
