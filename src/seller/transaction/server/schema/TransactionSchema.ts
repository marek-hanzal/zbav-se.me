import { z } from "zod";
import { PriceTypeEnumSchema } from "~/common/price-type/enum/PriceTypeEnumSchema";
import { CurrencyEnumSchema } from "~/common/schema/CurrencyEnumSchema";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { TransactionTableSchema } from "~/server/database/@table/TransactionTableSchema";
import { LocationSchema } from "~/session/location/server/schema/LocationSchema";
import { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";

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
