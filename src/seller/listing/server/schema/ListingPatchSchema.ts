import { z } from "zod";
import { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { TitleSchema } from "~/common/listing/schema/TitleSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { ListingQuerySchema } from "./ListingQuerySchema";

export const ListingPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				title: TitleSchema.optional(),
				categoryId: z.string().min(1).optional(),
				locationId: z.string().min(1).optional(),
				//
				restriction: RestrictionEnumSchema.nullish(),
				//
				priceType: ListingPriceEnumSchema.optional(),
				price: z.number().positive().nullish(),
				//
				expires: ListingExpireEnumSchema.optional(),
			})
			.strip(),
		query: ListingQuerySchema,
	})
	.strip();

export type ListingPatchSchema = typeof ListingPatchSchema;

export namespace ListingPatchSchema {
	export type Type = z.infer<ListingPatchSchema>;
}
