import { z } from "@hono/zod-openapi";

export const ListingSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the listing",
		}),
		userId: z.string().openapi({
			description: "ID of the user who created the listing",
		}),
		price: z.coerce.number().openapi({
			description: "Price of the listing",
			type: "number",
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
		createdAt: z.coerce.date().openapi({
			description: "Creation timestamp",
			type: "string",
		}),
		updatedAt: z.coerce.date().openapi({
			description: "Last update timestamp",
			type: "string",
		}),
	})
	.openapi("Listing", {
		description: "Represents a marketplace listing",
	});

export type ListingSchema = typeof ListingSchema;

export namespace ListingSchema {
	export type Type = z.infer<typeof ListingSchema>;
}
