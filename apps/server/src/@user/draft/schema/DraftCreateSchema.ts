import { z } from "@hono/zod-openapi";
import { ListingExpireEnumSchema } from "~/@user/listing/schema/ListingExpireEnumSchema";

export const DraftCreateSchema = z
	.object({
		price: z.coerce.number().optional().openapi({
			description: "Price of the draft",
			type: "number",
		}),
		condition: z.number().optional().openapi({
			description: "Condition of the item (0-based index)",
		}),
		age: z.number().optional().openapi({
			description: "Age of the item (0-based index)",
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
