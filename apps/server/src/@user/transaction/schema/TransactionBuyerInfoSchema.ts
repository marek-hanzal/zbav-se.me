import { z } from "@hono/zod-openapi";
import { UserEventBuyerSchema } from "~/@user/user-event/schema/UserEventBuyerSchema";

export const TransactionBuyerInfoSchema = z
	.object({
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
	.openapi("TransactionBuyerInfo", {
		description: "Buyer info for the transaction",
	});

export type TransactionBuyerInfoSchema = typeof TransactionBuyerInfoSchema;

export namespace TransactionBuyerInfoSchema {
	export type Type = z.infer<TransactionBuyerInfoSchema>;
}
