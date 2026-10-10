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
import { WarrantyEnumSchema } from "~/warranty/schema/WarrantyEnumSchema";

export const DraftTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the draft",
		}),
		userId: z.string().meta({
			description: "ID of the user who created the draft",
		}),
		//
		categoryId: z.string().min(1).nullish(),
		restriction: RestrictionEnumSchema.nullish(),
		//
		galleryId: z.string().min(1),
		withImageUrl: z.array(z.string().min(1)),
		withUploadIds: z.array(z.string().min(1)).meta({
			description:
				"Denormalized ordered upload IDs used for draft gallery management and consistency checks",
		}),
		//
		title: TitleSchema.nullish(),
		description: DescriptionSchema.nullish(),
		//
		locationId: z.string().min(1).nullish(),
		withLocation: z.unknown().nullable().meta({
			description: "Denormalized location geo point for draft search and range queries",
		}),
		//
		pros: ProsConsSchema,
		cons: ProsConsSchema,
		//
		delivery: z.array(DeliveryEnumSchema),
		warranty: WarrantyEnumSchema.nullish(),
		//
		priceType: PriceTypeEnumSchema.nullish(),
		price: z.coerce.number().nonnegative(),
		currency: CurrencyEnumSchema.nullish(),
		//
		condition: RatingSchema.nullish(),
		age: RatingSchema.nullish(),
		//
		expires: ListingExpireEnumSchema.nullish(),
		//
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
		}),
		updatedAt: z.coerce.date().meta({
			description: "Last update timestamp",
		}),
	})
	.meta({
		id: "DraftTable",
		description: "Database row for a draft.",
	})
	.strip();

export type DraftTableSchema = typeof DraftTableSchema;

export namespace DraftTableSchema {
	export type Type = z.infer<DraftTableSchema>;
}
