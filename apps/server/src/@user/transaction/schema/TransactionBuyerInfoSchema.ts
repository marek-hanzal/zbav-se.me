import { z } from "@hono/zod-openapi";
import { UserEventBuyerSchema } from "~/@buyer/user-event/schema/UserEventBuyerSchema";

export const TransactionBuyerInfoSchema = z
	.looseObject({
		registered: z.coerce.date().openapi({
			description: "Registration date",
			type: "string",
		}),
		events: z
			.xor([
				z.null(),
				UserEventBuyerSchema,
			])
			.openapi({
				description: "Buyer info may not be available if we don't have enough data",
			}),
	})
	.strip()
	.openapi("TransactionBuyerInfo", {
		description: "Buyer info for the transaction",
	});

export type TransactionBuyerInfoSchema = typeof TransactionBuyerInfoSchema;

export namespace TransactionBuyerInfoSchema {
	export type Type = z.infer<TransactionBuyerInfoSchema>;
}
