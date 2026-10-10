import { z } from "zod";
import { CurrencyEnumSchema } from "~/application/schema/CurrencyEnumSchema";
import { DeliveryEnumSchema } from "~/delivery/schema/DeliveryEnumSchema";
import { DescriptionSchema } from "~/listing/schema/DescriptionSchema";
import { ListingExpireEnumSchema } from "~/listing/schema/ListingExpireEnumSchema";
import { ProsConsSchema } from "~/listing/schema/ProsConsSchema";
import { RatingSchema } from "~/listing/schema/RatingSchema";
import { TitleSchema } from "~/listing/schema/TitleSchema";
import { PriceTypeEnumSchema } from "~/price-type/schema/PriceTypeEnumSchema";
import { RestrictionEnumSchema } from "~/restriction/schema/RestrictionEnumSchema";
import { DraftQuerySchema } from "~/seller-draft/schema/DraftQuerySchema";
import { WarrantyEnumSchema } from "~/warranty/schema/WarrantyEnumSchema";

export const DraftPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				title: TitleSchema.optional(),
				description: DescriptionSchema.nullish(),
				//
				categoryId: z.string().min(1).optional(),
				locationId: z.string().min(1).optional(),
				//
				restriction: RestrictionEnumSchema.nullish(),
				//
				priceType: PriceTypeEnumSchema.optional(),
				price: z.coerce.number().positive().optional(),
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
		query: DraftQuerySchema,
	})
	.strip();

export type DraftPatchSchema = typeof DraftPatchSchema;

export namespace DraftPatchSchema {
	export type Type = z.infer<DraftPatchSchema>;
}
