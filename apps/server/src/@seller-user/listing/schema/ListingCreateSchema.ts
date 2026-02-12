import { z } from "@hono/zod-openapi";
import { ListingExpireEnumSchema } from "~/@common/listing/schema/ListingExpireEnumSchema";
import { ProsConsSchema } from "~/@common/listing/schema/ProsConsSchema";
import { ListingDeliveryEnumSchema } from "~/database/@enum/ListingDeliveryEnumSchema";
import { ListingPriceEnumSchema } from "~/database/@enum/ListingPriceEnumSchema";
import { ListingRestrictionEnumSchema } from "~/database/@enum/ListingRestrictionEnumSchema";
import { ListingWarrantyEnumSchema } from "~/database/@enum/ListingWarrantyEnumSchema";

export const ListingCreateSchema = z
	.looseObject({
		price: z.coerce.number().openapi({
			description: "Price of the listing",
			type: "number",
		}),
		priceType: ListingPriceEnumSchema.openapi({
			description: "Price type of the listing",
		}),
		condition: z
			.union([
				z.null(),
				z.number(),
			])
			.openapi({
				description: "Condition of the item (0-based index)",
			}),
		age: z
			.union([
				z.null(),
				z.number(),
			])
			.openapi({
				description: "Age of the item (0-based index)",
			}),
		delivery: z
			.union([
				z.null(),
				z.array(ListingDeliveryEnumSchema),
			])
			.optional()
			.openapi({
				description: "Delivery methods for the listing",
			}),
		warranty: z
			.union([
				z.null(),
				ListingWarrantyEnumSchema,
			])
			.optional()
			.openapi({
				description: "Warranty type for the listing",
			}),
		restriction: ListingRestrictionEnumSchema.openapi({
			description: "Content restriction level of the listing (required)",
		}),
		draftId: z.string().optional().openapi({
			description: "ID of the draft",
		}),
		locationId: z.string().openapi({
			description: "ID of the location",
		}),
		categoryId: z.string().openapi({
			description: "ID of the category",
		}),
		expiresAt: ListingExpireEnumSchema,
		title: z.string().min(5).max(72).openapi({
			description: "Title of the item",
		}),
		description: z
			.union([
				z.null(),
				z.string().max(2048),
			])
			.optional()
			.openapi({
				description: "Description of the item",
			}),
		pros: z
			.union([
				z.null(),
				ProsConsSchema,
			])
			.optional()
			.openapi({
				description: "Pros of the item",
			}),
		cons: z
			.union([
				z.null(),
				ProsConsSchema,
			])
			.optional()
			.openapi({
				description: "Cons of the item",
			}),
		uploadIds: z.array(z.string()).min(1, "At least one upload is required").openapi({
			description: "IDs of the uploads; order of uploads defines order in the gallery",
		}),
	})
	.strip()
	.openapi("ListingCreate", {
		description: "Data for creating a new listing",
	});

export type ListingCreateSchema = typeof ListingCreateSchema;

export namespace ListingCreateSchema {
	export type Type = z.infer<ListingCreateSchema>;
}
