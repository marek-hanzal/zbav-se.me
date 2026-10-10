import { z } from "zod";
import { CurrencyEnumSchema } from "~/application/schema/CurrencyEnumSchema";
import { TransactionTableSchema } from "~/database/schema/TransactionTableSchema";
import { PriceTypeEnumSchema } from "~/price-type/schema/PriceTypeEnumSchema";
import { LocationSchema } from "~/session-location/schema/LocationSchema";
import { TransactionStatusEnumSchema } from "~/transaction-contract/schema/TransactionStatusEnumSchema";
import { TransactionEntrySchema } from "~/user-transaction-entry/schema/TransactionEntry";

export const TransactionSchema = z
	.looseObject({
		...TransactionTableSchema.shape,
		location: LocationSchema,
		title: z.string().meta({
			description: "Transaction title",
		}),
		status: TransactionStatusEnumSchema,
		entry: TransactionEntrySchema,
		priceType: PriceTypeEnumSchema,
		price: z.coerce.number().nullish(),
		currency: CurrencyEnumSchema.nullish(),
		lastAt: z.coerce.date().meta({
			description: "Timestamp of the latest seller-visible transaction activity",
		}),
		unread: z.coerce.number().int().nonnegative().meta({
			description: "Unread activity buyer-message count for this transaction",
			type: "number",
		}),
		//
		withImageUrl: z
			.tuple(
				[
					z.string(),
				],
				z.string(),
			)
			.meta({
				description: "Ordered listing image URLs",
			}),
	})
	.omit({
		userId: true,
	})
	.strip()
	.meta({
		id: "Transaction",
		description: "Transaction data",
	});

export type TransactionSchema = typeof TransactionSchema;

export namespace TransactionSchema {
	export type Type = z.infer<TransactionSchema>;
}
