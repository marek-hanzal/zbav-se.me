import { z } from "@hono/zod-openapi";
import { ListingPriceEnumSchema } from "~/@buyer-session/listing/schema/ListingPriceEnumSchema";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import { TransactionStatusEnumSchema } from "~/@buyer-user/transaction/schema/TransactionStatusEnumSchema";
import { TransactionTableSchema } from "~/database/@table/TransactionTableSchema";
import { CurrencyListEnumSchema } from "~/schema/CurrencyListEnumSchema";

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
		currency: CurrencyListEnumSchema,
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
