import { z } from "@hono/zod-openapi";
import { UserEventBuyerSchema } from "~/@user/user-event/schema/UserEventBuyerSchema";

export const TransactionBuyerInfoSchema = z
	.object({
		registered: z.coerce.date().openapi({
			description: "Registration date",
			type: "string",
		}),
		events: UserEventBuyerSchema,
	})
	.openapi("TransactionBuyerInfo", {
		description: "Buyer info for the transaction",
	});

export type TransactionBuyerInfoSchema = typeof TransactionBuyerInfoSchema;

export namespace TransactionBuyerInfoSchema {
	export type Type = z.infer<TransactionBuyerInfoSchema>;
}
