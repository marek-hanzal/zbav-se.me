import { z } from "zod";
import { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { ListingRestrictionEnumSchema } from "~/common/listing/enum/ListingRestrictionEnumSchema";
import { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";
import { ProsConsSchema } from "~/server/@seller/listing/schema/ProsConsSchema";

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
		delivery: z
			.union([
				z.null(),
				z.array(ListingDeliveryEnumSchema),
			])
			.optional()
			.meta({
				description: "Delivery methods for the draft",
			}),
		warranty: z
			.union([
				z.null(),
				ListingWarrantyEnumSchema,
			])
			.optional()
			.meta({
				description: "Warranty type for the draft",
			}),
		restriction: z
			.union([
				z.null(),
				ListingRestrictionEnumSchema,
			])
			.optional()
			.meta({
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
		pros: z
			.union([
				z.null(),
				ProsConsSchema,
			])
			.optional()
			.meta({
				description: "Pros of the item",
			}),
		cons: z
			.union([
				z.null(),
				ProsConsSchema,
			])
			.optional()
			.meta({
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
