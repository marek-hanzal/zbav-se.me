import { z } from "@hono/zod-openapi";
import { CurrencyListEnumSchema } from "~/schema/CurrencyListEnumSchema";
import { VectorSchema } from "~/schema/VectorSchema";
import { ListingDeliveryEnumSchema } from "./ListingDeliveryEnumSchema";
import { ListingPriceEnumSchema } from "./ListingPriceEnumSchema";
import { ListingWarrantyEnumSchema } from "./ListingWarrantyEnumSchema";
import { ProsConsSchema } from "./ProsConsSchema";

export const ListingDbSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the listing",
		}),
		userId: z.string().openapi({
			description: "ID of the user who created the listing",
		}),
		//
		price: z.coerce.number().openapi({
			description: "Price of the listing",
			type: "number",
		}),
		priceType: ListingPriceEnumSchema.openapi({
			description: "Price type of the listing",
		}),
		//
		currency: CurrencyListEnumSchema,
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
				z.array(ListingDeliveryEnumSchema),
				z.null(),
			])
			.openapi({
				description: "Delivery methods for the listing",
			}),
		//
		warranty: z
			.union([
				ListingWarrantyEnumSchema,
				z.null(),
			])
			.openapi({
				description: "Warranty type for the listing",
			}),
		//
		locationId: z.string().openapi({
			description: "ID of the location",
		}),
		categoryId: z.string().openapi({
			description: "ID of the category",
		}),
		galleryId: z.string().openapi({
			description: "ID of the gallery",
		}),
		draftId: z
			.union([
				z.string(),
				z.null(),
			])
			.openapi({
				description: "ID of the draft this listing was created from",
			}),
		expiresAt: z.coerce.date().openapi({
			description: "Expiration timestamp",
			type: "string",
		}),
		//
		title: z.string().openapi({
			description: "Title of the item",
		}),
		titleVec: VectorSchema.openapi({
			description: "Embedding vector for title similarity search",
		}),
		//
		description: z
			.union([
				z.string(),
				z.null(),
			])
			.openapi({
				description: "Description of the item",
			}),
		//
		pros: z
			.union([
				ProsConsSchema,
				z.null(),
			])
			.openapi({
				description: "Pros of the item",
			}),
		cons: z
			.union([
				ProsConsSchema,
				z.null(),
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
	})
	.strip();

export type ListingDbSchema = typeof ListingDbSchema;

export namespace ListingDbSchema {
	export type Type = z.infer<ListingDbSchema>;
}
