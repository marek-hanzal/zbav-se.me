import { z } from "@hono/zod-openapi";
import { ListingPriceEnumSchema } from "~/app/listing/schema/ListingPriceEnumSchema";
import { ListingExpireEnumSchema } from "./ListingExpireEnumSchema";

export const ListingCreateSchema = z
	.object({
		price: z.coerce.number().openapi({
			description: "Price of the listing",
			type: "number",
		}),
		priceType: ListingPriceEnumSchema.openapi({
			description: "Price type of the listing",
		}),
		condition: z.number().openapi({
			description: "Condition of the item (0-based index)",
		}),
		age: z.number().openapi({
			description: "Age of the item (0-based index)",
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
		uploadIds: z.array(z.string()).min(1, "At least one upload is required").openapi({
			description: "IDs of the uploads; order of uploads defines order in the gallery",
		}),
	})
	.openapi("ListingCreate", {
		description: "Data for creating a new listing",
	});

export type ListingCreateSchema = typeof ListingCreateSchema;

export namespace ListingCreateSchema {
	export type Type = z.infer<ListingCreateSchema>;
}
