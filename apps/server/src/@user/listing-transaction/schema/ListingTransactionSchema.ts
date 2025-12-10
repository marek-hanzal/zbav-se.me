import { z } from "@hono/zod-openapi";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import { ListingTransactionDbSchema } from "~/app/listing-transaction/schema/ListingTransactionDbSchema";
import { CurrencyListEnumSchema } from "~/schema/CurrencyListEnumSchema";

export const ListingTransactionSchema = z
	.object({
		...ListingTransactionDbSchema.shape,
		title: z.string().openapi({
			description: "Listing transaction title",
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
	.openapi("ListingTransaction", {
		description: "Listing transaction data",
	});

export type ListingTransactionSchema = typeof ListingTransactionSchema;

export namespace ListingTransactionSchema {
	export type Type = z.infer<ListingTransactionSchema>;
}
