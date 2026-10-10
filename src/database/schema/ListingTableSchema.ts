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
import { WarrantyEnumSchema } from "~/warranty/schema/WarrantyEnumSchema";

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
		price: z.coerce.number().nonnegative(),
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
