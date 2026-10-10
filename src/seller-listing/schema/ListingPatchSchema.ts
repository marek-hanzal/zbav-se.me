import { z } from "zod";
import { CurrencyEnumSchema } from "~/application/schema/CurrencyEnumSchema";
import { DeliveryEnumSchema } from "~/delivery/schema/DeliveryEnumSchema";
import { DescriptionSchema } from "~/listing/schema/DescriptionSchema";
import { ListingExpireEnumSchema } from "~/listing/schema/ListingExpireEnumSchema";
import { ListingStatusEnumSchema } from "~/listing/schema/ListingStatusEnumSchema";
import { ProsConsSchema } from "~/listing/schema/ProsConsSchema";
import { RatingSchema } from "~/listing/schema/RatingSchema";
import { TitleSchema } from "~/listing/schema/TitleSchema";
import { PriceTypeEnumSchema } from "~/price-type/schema/PriceTypeEnumSchema";
import { RestrictionEnumSchema } from "~/restriction/schema/RestrictionEnumSchema";
import { ListingQuerySchema } from "~/seller-listing/schema/ListingQuerySchema";
import { WarrantyEnumSchema } from "~/warranty/schema/WarrantyEnumSchema";

export const ListingPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				title: TitleSchema.optional(),
				description: DescriptionSchema.nullish(),
				//
				status: ListingStatusEnumSchema.optional(),
				//
				categoryId: z.string().min(1).optional(),
				locationId: z.string().min(1).optional(),
				//
				restriction: RestrictionEnumSchema.nullish(),
				//
				priceType: PriceTypeEnumSchema.optional(),
				price: z.coerce.number().positive().nullish(),
				currency: CurrencyEnumSchema.optional(),
				//
				expires: ListingExpireEnumSchema.optional(),
				//
				uploadIds: z.array(z.string().min(1)).min(1).optional(),
				withImageUrl: z.array(z.string().min(1)).min(1).optional(),
				withUploadIds: z.array(z.string().min(1)).min(1).optional(),
				//
				condition: RatingSchema.nullish(),
				age: RatingSchema.nullish(),
				//
				pros: ProsConsSchema.optional(),
				cons: ProsConsSchema.optional(),
				//
				delivery: z.array(DeliveryEnumSchema).optional(),
				//
				warranty: WarrantyEnumSchema.nullish(),
			})
			.strip(),
		query: ListingQuerySchema,
	})
	.strip();

export type ListingPatchSchema = typeof ListingPatchSchema;

export namespace ListingPatchSchema {
	export type Type = z.infer<ListingPatchSchema>;
}
