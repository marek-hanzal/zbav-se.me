import { z } from "@hono/zod-openapi";
import { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { ListingRestrictionEnumSchema } from "~/common/listing/enum/ListingRestrictionEnumSchema";
import { ListingStatusEnumSchema } from "~/common/listing/enum/ListingStatusEnumSchema";
import { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";
import { CurrencyEnumSchema } from "~/common/schema/CurrencyEnumSchema";
import { VectorSchema } from "~/common/schema/VectorSchema";
import { ProsConsSchema } from "~/server/@seller/listing/schema/ProsConsSchema";

export const ListingTableSchema = z
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
		currency: CurrencyEnumSchema,
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
				description: "Delivery methods for the listing",
			}),
		//
		warranty: z
			.union([
				z.null(),
				ListingWarrantyEnumSchema,
			])
			.openapi({
				description: "Warranty type for the listing",
			}),
		//
		status: ListingStatusEnumSchema,
		//
		restriction: ListingRestrictionEnumSchema,
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
				z.null(),
				z.string(),
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
				z.null(),
				z.string(),
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
	})
	.strip();

export type ListingTableSchema = typeof ListingTableSchema;

export namespace ListingTableSchema {
	export type Type = z.infer<ListingTableSchema>;
}
