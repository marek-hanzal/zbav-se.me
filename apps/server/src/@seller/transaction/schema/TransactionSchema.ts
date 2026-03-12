import { z } from "@hono/zod-openapi";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import { ListingPriceEnumSchema } from "~/database/@enum/ListingPriceEnumSchema";
import { TransactionEntryKindEnumSchema } from "~/database/@enum/TransactionEntryKindEnumSchema";
import { TransactionStatusEnumSchema } from "~/database/@enum/TransactionStatusEnumSchema";
import { TransactionTableSchema } from "~/database/@table/TransactionTableSchema";
import { CurrencyEnumSchema } from "~/schema/CurrencyEnumSchema";

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
		lastKind: TransactionEntryKindEnumSchema.nullable().openapi({
			description: "Kind of the latest activity inside this transaction",
		}),
		lastText: z.string().nullable().openapi({
			description: "Text payload of the latest activity when the latest activity is text",
		}),
		unreadCount: z.coerce.number().int().nonnegative().openapi({
			description: "Unread inbox buyer-message count for this transaction",
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
