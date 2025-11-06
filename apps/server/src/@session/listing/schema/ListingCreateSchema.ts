import { z } from "@hono/zod-openapi";
import { CurrencyListSchema } from "../../../schema/CurrencyListSchema";
import { ListingExpireSchema } from "./ListingExpireSchema";

export const ListingCreateSchema = z
	.object({
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
		categoryId: z.string().openapi({
			description: "ID of the category",
		}),
		currency: CurrencyListSchema,
		expiresAt: ListingExpireSchema,
		title: z.string().min(5).max(72).openapi({
			description: "Title of the item",
		}),
		description: z.string().max(2048).nullish().openapi({
			description: "Description of the item",
		}),
		uploadIds: z
			.array(z.string())
			.min(1, "At least one upload is required")
			.openapi({
				description:
					"IDs of the uploads; order of uploads defines order in the gallery",
			}),
	})
	.openapi("ListingCreate", {
		description: "Data required to create a new listing",
	});

export type ListingCreateSchema = typeof ListingCreateSchema;

export namespace ListingCreateSchema {
	export type Type = z.infer<typeof ListingCreateSchema>;
}
