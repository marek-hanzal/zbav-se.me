import { z } from "@hono/zod-openapi";
import { ListingExpireEnumSchema } from "~/common/listing/schema/ListingExpireEnumSchema";
import { ProsConsSchema } from "~/common/listing/schema/ProsConsSchema";
import { ListingDeliveryEnumSchema } from "~/server/database/@enum/ListingDeliveryEnumSchema";
import { ListingPriceEnumSchema } from "~/server/database/@enum/ListingPriceEnumSchema";
import { ListingRestrictionEnumSchema } from "~/server/database/@enum/ListingRestrictionEnumSchema";
import { ListingWarrantyEnumSchema } from "~/server/database/@enum/ListingWarrantyEnumSchema";

export const DraftCreateSchema = z
	.looseObject({
		price: z.coerce.number().optional().openapi({
			description: "Price of the draft",
			type: "number",
		}),
		priceType: ListingPriceEnumSchema.optional().openapi({
			description: "Price type of the draft",
		}),
		condition: z.number().optional().openapi({
			description: "Condition of the item (0-based index)",
		}),
		age: z.number().optional().openapi({
			description: "Age of the item (0-based index)",
		}),
		delivery: z
			.union([
				z.null(),
				z.array(ListingDeliveryEnumSchema),
			])
			.optional()
			.openapi({
				description: "Delivery methods for the draft",
			}),
		warranty: z
			.union([
				z.null(),
				ListingWarrantyEnumSchema,
			])
			.optional()
			.openapi({
				description: "Warranty type for the draft",
			}),
		restriction: z
			.union([
				z.null(),
				ListingRestrictionEnumSchema,
			])
			.optional()
			.openapi({
				description: "Content restriction level of the draft",
			}),
		locationId: z.string().optional().openapi({
			description: "ID of the location",
		}),
		categoryId: z.string().optional().openapi({
			description: "ID of the category",
		}),
		expiresAt: ListingExpireEnumSchema.optional(),
		title: z.string().min(5).max(72).optional().openapi({
			description: "Title of the item",
		}),
		description: z.string().max(2048).optional().openapi({
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
		uploadIds: z.array(z.string()).optional().openapi({
			description: "IDs of the uploads; order of uploads defines order in the gallery",
		}),
	})
	.strip()
	.openapi("DraftCreate", {
		description: "Data for creating a new draft",
	});

export type DraftCreateSchema = typeof DraftCreateSchema;

export namespace DraftCreateSchema {
	export type Type = z.infer<DraftCreateSchema>;
}
