import { z } from "zod";
import { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";
import { DescriptionSchema } from "~/common/listing/schema/DescriptionSchema";
import { ProsConsSchema } from "~/common/listing/schema/ProsConsSchema";
import { TitleSchema } from "~/common/listing/schema/TitleSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";

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
		restriction: RestrictionEnumSchema.nullish().meta({
			description: "Content restriction level of the draft",
		}),
		locationId: z.string().optional().meta({
			description: "ID of the location",
		}),
		categoryId: z.string().optional().meta({
			description: "ID of the category",
		}),
		expiresAt: ListingExpireEnumSchema.optional(),
		title: TitleSchema.nullish(),
		description: DescriptionSchema.nullish(),
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
