import { z } from "@hono/zod-openapi";
import { ListingExpireEnumSchema } from "~/app/listing/schema/ListingExpireEnumSchema";
import { ListingPriceEnumSchema } from "~/app/listing/schema/ListingPriceEnumSchema";
import { ListingWarrantyEnumSchema } from "~/app/listing/schema/ListingWarrantyEnumSchema";
import { ProsConsSchema } from "~/app/listing/schema/ProsConsSchema";

export const DraftCreateSchema = z
	.object({
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
		warranty: z
			.union([
				ListingWarrantyEnumSchema,
				z.null(),
			])
			.optional()
			.openapi({
				description: "Warranty type for the draft",
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
		uploadIds: z.array(z.string()).optional().openapi({
			description: "IDs of the uploads; order of uploads defines order in the gallery",
		}),
	})
	.openapi("DraftCreate", {
		description: "Data for creating a new draft",
	});

export type DraftCreateSchema = typeof DraftCreateSchema;

export namespace DraftCreateSchema {
	export type Type = z.infer<DraftCreateSchema>;
}
