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
		status: TransactionStatusEnumSchema,
		entry: TransactionEntrySchema,
		priceType: PriceTypeEnumSchema,
		price: z.coerce.number().nullish(),
		currency: CurrencyEnumSchema.nullish(),
		unread: z.coerce.number().int().nonnegative().meta({
			description: "Unread activity seller-message count for this transaction",
			type: "number",
		}),
		//
		title: z.string().meta({
			description: "Transaction title",
		}),
		location: LocationSchema,
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
