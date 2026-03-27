import { z } from "zod";
import { UserEventBuyerSchema } from "~/server/@seller/user-event/schema/UserEventBuyerSchema";

export const TransactionBuyerInfoSchema = z
	.looseObject({
		registered: z.coerce.date().meta({
			description: "Registration date",
			type: "string",
		}),
		events: z
			.union([
				z.null(),
				UserEventBuyerSchema,
			])
			.meta({
				description: "Buyer info may not be available if we don't have enough data",
			}),
	})
	.strip()
	.meta({
		id: "TransactionBuyerInfo",
		description: "Buyer info for the transaction",
	});

export type TransactionBuyerInfoSchema = typeof TransactionBuyerInfoSchema;

export namespace TransactionBuyerInfoSchema {
	export type Type = z.infer<typeof TransactionBuyerInfoSchema>;
}
