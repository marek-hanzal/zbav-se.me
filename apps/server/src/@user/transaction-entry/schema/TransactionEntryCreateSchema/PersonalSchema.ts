import { z } from "@hono/zod-openapi";
import { EntrySchema } from "./EntrySchema";

export const PersonalSchema = z
	.looseObject({
		...EntrySchema.shape,
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
	.strip()
	.openapi("TransactionEntryPersonalCreate");

export type PersonalSchema = typeof PersonalSchema;

export namespace PersonalSchema {
	export type Type = z.infer<PersonalSchema>;
}
