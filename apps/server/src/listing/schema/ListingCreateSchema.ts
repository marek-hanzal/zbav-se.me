import { z } from "@hono/zod-openapi";

export const ListingCreateSchema = z
	.object({
		price: z.coerce.number().openapi({
			description: "Price of the listing",
		}),
		condition: z.number().openapi({
			description: "Condition of the item (0-based index)",
		}),
		age: z.number().openapi({
			description: "Age of the item (0-based index)",
		}),
		locationId: z.string().openapi({
			description: "ID of the location",
		}),
		categoryGroupId: z.string().openapi({
			description: "ID of the category group",
		}),
		categoryId: z.string().openapi({
			description: "ID of the category",
		}),
	})
	.openapi("ListingCreate", {
		description: "Data required to create a new listing",
	});

export type ListingCreateSchema = typeof ListingCreateSchema;

export namespace ListingCreateSchema {
	export type Type = z.infer<typeof ListingCreateSchema>;
}
