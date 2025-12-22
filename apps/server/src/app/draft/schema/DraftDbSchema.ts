import { z } from "@hono/zod-openapi";
import { ListingExpireEnumSchema } from "~/@user/listing/schema/ListingExpireEnumSchema";
import { ListingDeliveryEnumSchema } from "~/app/listing/schema/ListingDeliveryEnumSchema";
import { ListingPriceEnumSchema } from "~/app/listing/schema/ListingPriceEnumSchema";
import { CurrencyListEnumSchema } from "~/schema/CurrencyListEnumSchema";

export const DraftDbSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the draft",
		}),
		userId: z.string().openapi({
			description: "ID of the user who created the draft",
		}),
		//
		price: z
			.union([
				z.coerce.number(),
				z.null(),
			])
			.openapi({
				description: "Price of the draft",
			}),
		priceType: z
			.union([
				ListingPriceEnumSchema,
				z.null(),
			])
			.openapi({
				description: "Price type of the draft",
			}),
		//
		currency: z
			.union([
				CurrencyListEnumSchema,
				z.null(),
			])
			.openapi({
				description: "Currency of the draft",
			}),
		//
		condition: z
			.union([
				z.number(),
				z.null(),
			])
			.openapi({
				description: "Condition of the item (0-based index)",
			}),
		//
		age: z
			.union([
				z.number(),
				z.null(),
			])
			.openapi({
				description: "Age of the item (0-based index)",
			}),
		//
		delivery: z
			.union([
				ListingDeliveryEnumSchema,
				z.null(),
			])
			.openapi({
				description: "Delivery method for the draft",
			}),
		//
		locationId: z
			.union([
				z.string(),
				z.null(),
			])
			.openapi({
				description: "ID of the location",
			}),
		categoryId: z
			.union([
				z.string(),
				z.null(),
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
				z.string(),
				z.null(),
			])
			.openapi({
				description: "Title of the item",
			}),
		//
		description: z
			.union([
				z.string().max(2048),
				z.null(),
			])
			.openapi({
				description: "Description of the item",
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
				z.coerce.date(),
			])
			.openapi({
				description: "Timestamp when the draft was used to create a listing",
			}),
	})
	.strip();

export type DraftDbSchema = typeof DraftDbSchema;

export namespace DraftDbSchema {
	export type Type = z.infer<DraftDbSchema>;
}
