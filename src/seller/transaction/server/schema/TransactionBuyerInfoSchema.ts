import { z } from "zod";
import { UserEventBuyerSchema } from "~/seller/user-event/server/schema/UserEventBuyerSchema";

export const TransactionBuyerInfoSchema = z
	.looseObject({
		registered: z.coerce.date().meta({
			description: "Registration date",
			type: "string",
		}),
		events: UserEventBuyerSchema.nullable().meta({
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
