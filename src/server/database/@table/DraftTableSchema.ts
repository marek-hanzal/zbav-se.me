import { z } from "zod";
import { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";
import { DescriptionSchema } from "~/common/listing/schema/DescriptionSchema";
import { ProsConsSchema } from "~/common/listing/schema/ProsConsSchema";
import { TitleSchema } from "~/common/listing/schema/TitleSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { CurrencyEnumSchema } from "~/common/schema/CurrencyEnumSchema";

export const DraftTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the draft",
		}),
		userId: z.string().meta({
			description: "ID of the user who created the draft",
		}),
		//
		price: z.coerce.number().nullable().meta({
			description: "Price of the draft",
		}),
		priceType: ListingPriceEnumSchema.nullable().meta({
			description: "Price type of the draft",
		}),
		//
		currency: CurrencyEnumSchema.nullable().meta({
			description: "Currency of the draft",
		}),
		//
		condition: z.number().nullable().meta({
			description: "Condition of the item (0-based index)",
		}),
		//
		age: z.number().nullable().meta({
			description: "Age of the item (0-based index)",
		}),
		//
		delivery: z.array(ListingDeliveryEnumSchema).nullable().meta({
			description: "Delivery methods for the draft",
		}),
		//
		warranty: ListingWarrantyEnumSchema.nullable().meta({
			description: "Warranty type for the draft",
		}),
		//
		restriction: RestrictionEnumSchema.nullish().meta({
			description: `
Restriction override for the listing (draft). May be only higher level than
category of the listing - e.g. "adult" category cannot get "none" restriction.

If not provided, listing will be controlled from category only.
            `.trim(),
		}),
		//
		locationId: z.string().nullable().meta({
			description: "ID of the location",
		}),
		categoryId: z.string().nullable().meta({
			description: "ID of the category",
		}),
		galleryId: z.string().meta({
			description: "ID of the gallery",
		}),
		expiresAt: ListingExpireEnumSchema.nullable().meta({
			description: "Expiration timestamp",
		}),
		//
		title: TitleSchema.nullish(),
		//
		description: DescriptionSchema.nullish(),
		//
		pros: ProsConsSchema.nullable().meta({
			description: "Pros of the item",
		}),
		cons: ProsConsSchema.nullable().meta({
			description: "Cons of the item",
		}),
		//
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
		}),
		updatedAt: z.coerce.date().meta({
			description: "Last update timestamp",
		}),
		usedAt: z.coerce.date().nullable().meta({
			description: "Timestamp when the draft was used to create a listing",
		}),
	})
	.meta({
		id: "DraftTable",
		description: "Database row for a draft listing.",
	})
	.strip();

export type DraftTableSchema = typeof DraftTableSchema;

export namespace DraftTableSchema {
	export type Type = z.infer<DraftTableSchema>;
}
