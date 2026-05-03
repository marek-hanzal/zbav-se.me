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

export const ListingTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the listing",
		}),
		userId: z.string().meta({
			description: "ID of the user who created the listing",
		}),
		//
		categoryId: z.string().min(1),
		//
		status: ListingStatusEnumSchema,
		restriction: RestrictionEnumSchema.nullable(),
		//
		galleryId: z.string().min(1),
		withImageUrl: z
			.tuple(
				[
					z.string().min(1),
				],
				z.string().min(1),
			)
			.meta({
				description: "Ordered image URLs for listing gallery",
			}),
		withUploadIds: z
			.tuple(
				[
					z.string().min(1),
				],
				z.string().min(1),
			)
			.meta({
				description:
					"Denormalized ordered upload IDs used for draft gallery management and consistency checks",
			}),
		/**
		 * Core listing attributes
		 */
		title: TitleSchema,
		withTitle: z.string().min(1).meta({
			description: "Lowercase unaccented title used for search",
		}),
		description: DescriptionSchema.nullish(),
		//
		locationId: z.string().min(1),
		withLocation: z.unknown().meta({
			description: "Denormalized location geo point for listing search and range queries",
		}),
		//
		pros: ProsConsSchema,
		cons: ProsConsSchema,
		//
		delivery: z.array(DeliveryEnumSchema),
		//
		warranty: WarrantyEnumSchema.nullish(),
		//
		priceType: PriceTypeEnumSchema,
		price: z.coerce.number().positive(),
		currency: CurrencyEnumSchema.nullish(),
		//
		condition: RatingSchema.nullish(),
		age: RatingSchema.nullish(),
		//
		expires: ListingExpireEnumSchema,
		//
		visibleAt: z.coerce.date().meta({
			description: "When a listing goes live",
		}),
		expiresAt: z.coerce.date().meta({
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
