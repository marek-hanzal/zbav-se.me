import { z } from "zod";
import { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";
import { DescriptionSchema } from "~/common/listing/schema/DescriptionSchema";
import { ProsConsSchema } from "~/common/listing/schema/ProsConsSchema";
import { RatingSchema } from "~/common/listing/schema/RatingSchema";
import { TitleSchema } from "~/common/listing/schema/TitleSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { ListingQuerySchema } from "./ListingQuerySchema";

export const ListingPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				title: TitleSchema.optional(),
				description: DescriptionSchema.nullish(),
				categoryId: z.string().min(1).optional(),
				locationId: z.string().min(1).optional(),
				//
				restriction: RestrictionEnumSchema.nullish(),
				//
				priceType: ListingPriceEnumSchema.optional(),
				price: z.coerce.number().positive().nullish(),
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
				delivery: z.array(ListingDeliveryEnumSchema).optional(),
				//
				warranty: ListingWarrantyEnumSchema.nullish(),
			})
			.strip(),
		query: ListingQuerySchema,
	})
	.strip();

export type ListingPatchSchema = typeof ListingPatchSchema;

export namespace ListingPatchSchema {
	export type Type = z.infer<ListingPatchSchema>;
}
