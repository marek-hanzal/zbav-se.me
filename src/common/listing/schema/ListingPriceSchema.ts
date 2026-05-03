import { z } from "zod";
import { CurrencyEnumSchema } from "~/common/schema/CurrencyEnumSchema";
import { PriceTypeEnumSchema } from "../../price-type/enum/PriceTypeEnumSchema";

export const ListingPriceSchema = z.discriminatedUnion("priceType", [
	z.object({
		priceType: PriceTypeEnumSchema.extract([
			"fixed",
			"haggle",
		]),
		price: z.coerce.number().positive(),
		currency: CurrencyEnumSchema,
	}),
	z.object({
		priceType: PriceTypeEnumSchema.extract([
			"ask",
			"free",
			"haulaway",
		]),
		price: z.null().nullish(),
		currency: z.null().nullish(),
	}),
	z.object({
		priceType: z.null().nullish(),
		price: z.null().nullish(),
		currency: z.null().nullish(),
	}),
]);

export type ListingPriceSchema = typeof ListingPriceSchema;

export namespace ListingPriceSchema {
	export type Type = z.infer<ListingPriceSchema>;
}
