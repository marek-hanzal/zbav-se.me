import { z } from "zod";
import { CurrencyEnumSchema } from "~/common/schema/CurrencyEnumSchema";
import type { ListingPriceEnumSchema } from "../enum/ListingPriceEnumSchema";

export const ListingPriceSchema = z.discriminatedUnion("priceType", [
	z.object({
		priceType: z.literal("open" satisfies ListingPriceEnumSchema.Type),
		price: z.coerce.number().positive(),
		currency: CurrencyEnumSchema,
	}),
	z.object({
		priceType: z.enum([
			"open",
			"closed",
		] satisfies ListingPriceEnumSchema.Type[]),
		price: z.coerce.number().positive(),
		currency: CurrencyEnumSchema,
	}),
	z.object({
		priceType: z.literal("offer"),
	}),
	z.object({
		priceType: z.null().optional(),
		price: z.number().nullish(),
		currency: CurrencyEnumSchema.nullish(),
	}),
]);

export type ListingPriceSchema = typeof ListingPriceSchema;

export namespace ListingPriceSchema {
	export type Type = z.infer<ListingPriceSchema>;
}
