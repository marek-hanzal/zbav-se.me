import { z } from "zod";
import { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { ListingRestrictionEnumSchema } from "~/common/listing/enum/ListingRestrictionEnumSchema";
import { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";
import { CurrencyEnumSchema } from "~/common/schema/CurrencyEnumSchema";
import { ProsConsSchema } from "~/server/@seller/listing/schema/ProsConsSchema";

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
		priceType: z
			.union([
				z.null(),
				ListingPriceEnumSchema,
			])
			.meta({
				description: "Price type of the draft",
			}),
		//
		currency: z
			.union([
				z.null(),
				CurrencyEnumSchema,
			])
			.meta({
				description: "Currency of the draft",
			}),
		//
		condition: z
			.union([
				z.null(),
				z.number(),
			])
			.meta({
				description: "Condition of the item (0-based index)",
			}),
		//
		age: z
			.union([
				z.null(),
				z.number(),
			])
			.meta({
				description: "Age of the item (0-based index)",
			}),
		//
		delivery: z
			.union([
				z.null(),
				z.array(ListingDeliveryEnumSchema),
			])
			.meta({
				description: "Delivery methods for the draft",
			}),
		//
		warranty: z
			.union([
				z.null(),
				ListingWarrantyEnumSchema,
			])
			.meta({
				description: "Warranty type for the draft",
			}),
		//
		restriction: z
			.union([
				z.null(),
				ListingRestrictionEnumSchema,
			])
			.meta({
				description: "Content restriction level of the draft",
			}),
		//
		locationId: z
			.union([
				z.null(),
				z.string(),
			])
			.meta({
				description: "ID of the location",
			}),
		categoryId: z
			.union([
				z.null(),
				z.string(),
			])
			.meta({
				description: "ID of the category",
			}),
		galleryId: z.string().meta({
			description: "ID of the gallery",
		}),
		expiresAt: z
			.union([
				z.null(),
				ListingExpireEnumSchema,
			])
			.meta({
				description: "Expiration timestamp",
			}),
		//
		title: z
			.union([
				z.null(),
				z.string(),
			])
			.meta({
				description: "Title of the item",
			}),
		//
		description: z
			.union([
				z.null(),
				z.string().max(2048),
			])
			.meta({
				description: "Description of the item",
			}),
		//
		pros: z
			.union([
				z.null(),
				ProsConsSchema,
			])
			.meta({
				description: "Pros of the item",
			}),
		cons: z
			.union([
				z.null(),
				ProsConsSchema,
			])
			.meta({
				description: "Cons of the item",
			}),
		//
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
		updatedAt: z.coerce.date().meta({
			description: "Last update timestamp",
			type: "string",
		}),
		usedAt: z
			.union([
				z.null(),
				z.coerce.date().meta({
					type: "string",
				}),
			])
			.meta({
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
