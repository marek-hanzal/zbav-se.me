import { z } from "zod";
import { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";
import { DescriptionSchema } from "~/common/listing/schema/DescriptionSchema";
import { ProsConsSchema } from "~/common/listing/schema/ProsConsSchema";
import { TitleSchema } from "~/common/listing/schema/TitleSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";

export const ListingCreateSchema = z
	.looseObject({
		price: z.coerce.number().meta({
			description: "Price of the listing",
			type: "number",
		}),
		priceType: ListingPriceEnumSchema,
		condition: z.number().nullable().meta({
			description: "Condition of the item (0-based index)",
		}),
		age: z.number().nullable().meta({
			description: "Age of the item (0-based index)",
		}),
		delivery: z.array(ListingDeliveryEnumSchema).nullable().meta({
			description: "Delivery methods for the listing",
		}),
		warranty: ListingWarrantyEnumSchema.nullable().meta({
			description: "Warranty type for the listing",
		}),
		restriction: RestrictionEnumSchema.nullable().meta({
			description: `
Restriction may get only higher level than provided from category, e.g. "adult" category
cannot get "none" restriction on it's listings.
            `.trim(),
		}),
		draftId: z.string().optional().meta({
			description: "ID of the draft",
		}),
		locationId: z.string().meta({
			description: "ID of the location",
		}),
		categoryId: z.string().meta({
			description: "ID of the category",
		}),
		expiresAt: ListingExpireEnumSchema,
		title: TitleSchema,
		description: DescriptionSchema.nullish(),
		pros: ProsConsSchema.nullish().meta({
			description: "Pros of the item",
		}),
		cons: ProsConsSchema.nullish().meta({
			description: "Cons of the item",
		}),
		uploadIds: z.array(z.string()).min(1, "At least one upload is required").meta({
			description: "IDs of the uploads; order of uploads defines order in the gallery",
		}),
	})
	.strip()
	.meta({
		id: "ListingCreate",
		description: "Data for creating a new listing",
	});

export type ListingCreateSchema = typeof ListingCreateSchema;

export namespace ListingCreateSchema {
	export type Type = z.infer<ListingCreateSchema>;
}
