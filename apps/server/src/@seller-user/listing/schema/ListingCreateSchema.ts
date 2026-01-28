import { z } from "@hono/zod-openapi";
import { ListingDeliveryEnumSchema } from "~/database/@enum/ListingDeliveryEnumSchema";
import { ListingExpireEnumSchema } from "~/@buyer-user/listing/schema/ListingExpireEnumSchema";
import { ListingPriceEnumSchema } from "~/database/@enum/ListingPriceEnumSchema";
import { ListingWarrantyEnumSchema } from "~/database/@enum/ListingWarrantyEnumSchema";
import { ProsConsSchema } from "~/@common/listing/schema/ProsConsSchema";

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
				z.number(),
				z.null(),
			])
			.openapi({
				description: "Condition of the item (0-based index)",
			}),
		age: z
			.union([
				z.number(),
				z.null(),
			])
			.openapi({
				description: "Age of the item (0-based index)",
			}),
		delivery: z
			.union([
				z.array(ListingDeliveryEnumSchema),
				z.null(),
			])
			.optional()
			.openapi({
				description: "Delivery methods for the listing",
			}),
		warranty: z
			.union([
				ListingWarrantyEnumSchema,
				z.null(),
			])
			.optional()
			.openapi({
				description: "Warranty type for the listing",
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
				z.string().max(2048),
				z.null(),
			])
			.optional()
			.openapi({
				description: "Description of the item",
			}),
		pros: z
			.union([
				ProsConsSchema,
				z.null(),
			])
			.optional()
			.openapi({
				description: "Pros of the item",
			}),
		cons: z
			.union([
				ProsConsSchema,
				z.null(),
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
