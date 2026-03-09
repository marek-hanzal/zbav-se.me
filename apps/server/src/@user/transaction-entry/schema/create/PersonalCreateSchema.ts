import { z } from "@hono/zod-openapi";
import { BaseCreateSchema } from "./BaseCreateSchema";

export const PersonalCreateSchema = z
	.looseObject({
		...BaseCreateSchema.shape,
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
	.openapi("TransactionEntryPersonalCreate");

export type PersonalCreateSchema = typeof PersonalCreateSchema;

export namespace PersonalCreateSchema {
	export type Type = z.infer<PersonalCreateSchema>;
}
