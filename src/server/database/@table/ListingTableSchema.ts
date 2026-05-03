import { z } from "zod";
import { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { ListingStatusEnumSchema } from "~/common/listing/enum/ListingStatusEnumSchema";
import { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";
import { DescriptionSchema } from "~/common/listing/schema/DescriptionSchema";
import { ProsConsSchema } from "~/common/listing/schema/ProsConsSchema";
import { RatingSchema } from "~/common/listing/schema/RatingSchema";
import { TitleSchema } from "~/common/listing/schema/TitleSchema";
import { PriceTypeEnumSchema } from "~/common/price-type/enum/PriceTypeEnumSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { CurrencyEnumSchema } from "~/common/schema/CurrencyEnumSchema";

export const ListingTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the listing",
		}),
		userId: z.string().meta({
			description: "ID of the user who created the listing",
		}),
		//
		categoryId: z.string().min(1).nullish(),
		//
		status: ListingStatusEnumSchema,
		restriction: RestrictionEnumSchema.nullish(),
		//
		galleryId: z.string().min(1),
		withImageUrl: z.array(z.string().min(1)),
		withUploadIds: z.array(z.string().min(1)).meta({
			description:
				"Denormalized ordered upload IDs used for draft gallery management and consistency checks",
		}),
		/**
		 * Core listing attributes
		 */
		title: TitleSchema.nullish(),
		description: DescriptionSchema.nullish(),
		//
		locationId: z.string().min(1).nullish(),
		withLocation: z.unknown().nullable().meta({
			description: "Denormalized location geo point for listing search and range queries",
		}),
		//
		pros: ProsConsSchema,
		cons: ProsConsSchema,
		//
		delivery: z.array(ListingDeliveryEnumSchema),
		//
		warranty: ListingWarrantyEnumSchema.nullish(),
		//
		priceType: PriceTypeEnumSchema.nullish(),
		price: z.coerce.number().positive().nullish(),
		currency: CurrencyEnumSchema.nullish(),
		//
		condition: RatingSchema.nullish(),
		age: RatingSchema.nullish(),
		//
		expires: ListingExpireEnumSchema.nullish(),
		//
		visibleAt: z.coerce.date().nullish().meta({
			description: "When a listing goes live",
		}),
		expiresAt: z.coerce.date().nullish().meta({
			description: "When a listing dies",
		}),
		//
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
		}),
		updatedAt: z.coerce.date().meta({
			description: "Last update timestamp",
		}),
	})
	.meta({
		id: "ListingTable",
		description: "Database row for a listing.",
	})
	.strip();

export type ListingTableSchema = typeof ListingTableSchema;

export namespace ListingTableSchema {
	export type Type = z.infer<ListingTableSchema>;
}
