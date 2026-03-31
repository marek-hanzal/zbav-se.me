import { z } from "zod";
import { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { CurrencyEnumSchema } from "~/common/schema/CurrencyEnumSchema";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { TransactionTableSchema } from "~/server/database/@table/TransactionTableSchema";
import { LocationSchema } from "~/session/location/server/schema/LocationSchema";
import { GallerySchema } from "~/user/gallery/server/schema/GallerySchema";
import { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";

export const TransactionSchema = z
	.looseObject({
		...TransactionTableSchema.shape,
		title: z.string().meta({
			description: "Transaction title",
		}),
		status: TransactionStatusEnumSchema,
		//
		gallery: GallerySchema,
		//
		price: z.coerce.number().meta({
			description: "Price of the listing",
			type: "number",
		}),
		priceType: ListingPriceEnumSchema,
		currency: CurrencyEnumSchema,
		entry: TransactionEntrySchema,
		unreadCount: z.coerce.number().int().nonnegative().meta({
			description: "Unread inbox seller-message count for this transaction",
			type: "number",
		}),
		//
		location: LocationSchema,
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
