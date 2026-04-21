import { z } from "zod";
import { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";
import { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";
import { ProsConsSchema } from "~/seller/listing/server/schema/ProsConsSchema";

export const DraftCreateSchema = z
	.looseObject({
		price: z.coerce.number().optional().meta({
			description: "Price of the draft",
			type: "number",
		}),
		priceType: ListingPriceEnumSchema.optional().meta({
			description: "Price type of the draft",
		}),
		condition: z.number().optional().meta({
			description: "Condition of the item (0-based index)",
		}),
		age: z.number().optional().meta({
			description: "Age of the item (0-based index)",
		}),
		delivery: z.array(ListingDeliveryEnumSchema).nullish().meta({
			description: "Delivery methods for the draft",
		}),
		warranty: ListingWarrantyEnumSchema.nullish().meta({
			description: "Warranty type for the draft",
		}),
		restriction: CategoryRestrictionEnumSchema.nullish().meta({
			description: "Content restriction level of the draft",
		}),
		locationId: z.string().optional().meta({
			description: "ID of the location",
		}),
		categoryId: z.string().optional().meta({
			description: "ID of the category",
		}),
		expiresAt: ListingExpireEnumSchema.optional(),
		title: z.string().min(5).max(72).optional().meta({
			description: "Title of the item",
		}),
		description: z.string().max(2048).optional().meta({
			description: "Description of the item",
		}),
		pros: ProsConsSchema.nullish().meta({
			description: "Pros of the item",
		}),
		cons: ProsConsSchema.nullish().meta({
			description: "Cons of the item",
		}),
		uploadIds: z.array(z.string()).optional().meta({
			description: "IDs of the uploads; order of uploads defines order in the gallery",
		}),
	})
	.strip()
	.meta({
		id: "DraftCreate",
		description: "Data for creating a new draft",
	});

export type DraftCreateSchema = typeof DraftCreateSchema;

export namespace DraftCreateSchema {
	export type Type = z.infer<DraftCreateSchema>;
}
