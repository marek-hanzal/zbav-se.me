import { z } from "@hono/zod-openapi";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import { TransactionDbSchema } from "~/app/transaction/schema/ListingTransactionDbSchema";
import { CurrencyListEnumSchema } from "~/schema/CurrencyListEnumSchema";

export const TransactionSchema = z
	.object({
		...TransactionDbSchema.shape,
		title: z.string().openapi({
			description: "Transaction title",
		}),
		//
		gallery: GallerySchema,
		//
		price: z.coerce.number().openapi({
			description: "Price of the listing",
			type: "number",
		}),
		currency: CurrencyListEnumSchema,
		//
		location: LocationSchema,
	})
	.omit({
		userId: true,
	})
	.openapi("Transaction", {
		description: "Transaction data",
	});

export type TransactionSchema = typeof TransactionSchema;

export namespace TransactionSchema {
	export type Type = z.infer<TransactionSchema>;
}
