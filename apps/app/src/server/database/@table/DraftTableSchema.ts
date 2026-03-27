import { z } from "@hono/zod-openapi";
import { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { ListingRestrictionEnumSchema } from "~/common/listing/enum/ListingRestrictionEnumSchema";
import { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";
import { CurrencyEnumSchema } from "~/common/schema/CurrencyEnumSchema";
import { ProsConsSchema } from "~/server/@seller/listing/schema/ProsConsSchema";

export const DraftTableSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the draft",
		}),
		userId: z.string().openapi({
			description: "ID of the user who created the draft",
		}),
		//
		price: z.coerce.number().nullable().openapi({
			description: "Price of the draft",
		}),
		priceType: z
			.union([
				z.null(),
				ListingPriceEnumSchema,
			])
			.openapi({
				description: "Price type of the draft",
			}),
		//
		currency: z
			.union([
				z.null(),
				CurrencyEnumSchema,
			])
			.openapi({
				description: "Currency of the draft",
			}),
		//
		condition: z
			.union([
				z.null(),
				z.number(),
			])
			.openapi({
				description: "Condition of the item (0-based index)",
			}),
		//
		age: z
			.union([
				z.null(),
				z.number(),
			])
			.openapi({
				description: "Age of the item (0-based index)",
			}),
		//
		delivery: z
			.union([
				z.null(),
				z.array(ListingDeliveryEnumSchema),
			])
			.openapi({
				description: "Delivery methods for the draft",
			}),
		//
		warranty: z
			.union([
				z.null(),
				ListingWarrantyEnumSchema,
			])
			.openapi({
				description: "Warranty type for the draft",
			}),
		//
		restriction: z
			.union([
				z.null(),
				ListingRestrictionEnumSchema,
			])
			.openapi({
				description: "Content restriction level of the draft",
			}),
		//
		locationId: z
			.union([
				z.null(),
				z.string(),
			])
			.openapi({
				description: "ID of the location",
			}),
		categoryId: z
			.union([
				z.null(),
				z.string(),
			])
			.openapi({
				description: "ID of the category",
			}),
		galleryId: z.string().openapi({
			description: "ID of the gallery",
		}),
		expiresAt: z
			.union([
				z.null(),
				ListingExpireEnumSchema,
			])
			.openapi({
				description: "Expiration timestamp",
			}),
		//
		title: z
			.union([
				z.null(),
				z.string(),
			])
			.openapi({
				description: "Title of the item",
			}),
		//
		description: z
			.union([
				z.null(),
				z.string().max(2048),
			])
			.openapi({
				description: "Description of the item",
			}),
		//
		pros: z
			.union([
				z.null(),
				ProsConsSchema,
			])
			.openapi({
				description: "Pros of the item",
			}),
		cons: z
			.union([
				z.null(),
				ProsConsSchema,
			])
			.openapi({
				description: "Cons of the item",
			}),
		//
		createdAt: z.coerce.date().openapi({
			description: "Creation timestamp",
			type: "string",
		}),
		updatedAt: z.coerce.date().openapi({
			description: "Last update timestamp",
			type: "string",
		}),
		usedAt: z
			.union([
				z.null(),
				z.coerce.date().openapi({
					type: "string",
				}),
			])
			.openapi({
				description: "Timestamp when the draft was used to create a listing",
			}),
	})
	.strip();

export type DraftTableSchema = typeof DraftTableSchema;

export namespace DraftTableSchema {
	export type Type = z.infer<DraftTableSchema>;
}
