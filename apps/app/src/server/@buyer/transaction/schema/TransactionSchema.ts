import { z } from "@hono/zod-openapi";
import { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { CurrencyEnumSchema } from "~/common/schema/CurrencyEnumSchema";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { LocationSchema } from "~/server/@session/location/schema/LocationSchema";
import { GallerySchema } from "~/server/@user/gallery/schema/GallerySchema";
import { TransactionEntrySchema } from "~/server/@user/transaction-entry/schema/TransactionEntrySchema";
import { TransactionTableSchema } from "~/server/database/@table/TransactionTableSchema";

export const TransactionSchema = z
	.looseObject({
		...TransactionTableSchema.shape,
		title: z.string().openapi({
			description: "Transaction title",
		}),
		status: TransactionStatusEnumSchema,
		//
		gallery: GallerySchema,
		//
		price: z.coerce.number().openapi({
			description: "Price of the listing",
			type: "number",
		}),
		priceType: ListingPriceEnumSchema,
		currency: CurrencyEnumSchema,
		entry: TransactionEntrySchema,
		unreadCount: z.coerce.number().int().nonnegative().openapi({
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
	.openapi("Transaction", {
		description: "Transaction data",
	});

export type TransactionSchema = typeof TransactionSchema;

export namespace TransactionSchema {
	export type Type = z.infer<TransactionSchema>;
}
