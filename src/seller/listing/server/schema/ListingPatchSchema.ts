import { z } from "zod";
import { DeliveryEnumSchema } from "~/common/delivery/enum/DeliveryEnumSchema";
import { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { ListingStatusEnumSchema } from "~/common/listing/enum/ListingStatusEnumSchema";
import { DescriptionSchema } from "~/common/listing/schema/DescriptionSchema";
import { ProsConsSchema } from "~/common/listing/schema/ProsConsSchema";
import { RatingSchema } from "~/common/listing/schema/RatingSchema";
import { TitleSchema } from "~/common/listing/schema/TitleSchema";
import { PriceTypeEnumSchema } from "~/common/price-type/enum/PriceTypeEnumSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { CurrencyEnumSchema } from "~/common/schema/CurrencyEnumSchema";
import { WarrantyEnumSchema } from "~/common/warranty/enum/WarrantyEnumSchema";
import { ListingQuerySchema } from "./ListingQuerySchema";

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
