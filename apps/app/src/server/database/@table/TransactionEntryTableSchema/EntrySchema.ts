import { z } from "@hono/zod-openapi";

export const EntrySchema = z
	.looseObject({
		id: z.string().openapi({
			description: "Transaction entry identifier",
		}),
		transactionId: z.string().openapi({
			description: "Transaction identifier",
		}),
		userId: z.string().nullable().openapi({
			description: "Author/actor user identifier",
		}),
		createdAt: z.coerce.date().openapi({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.strip();

export type EntrySchema = typeof EntrySchema;

export namespace EntrySchema {
	export type Type = z.infer<EntrySchema>;
}
