import { z } from "@hono/zod-openapi";
import { CurrencyListEnumSchema } from "~/schema/CurrencyListEnumSchema";
import { VectorSchema } from "~/schema/VectorSchema";

export const ListingDbSchema = z
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
		//
		currency: CurrencyListEnumSchema,
		//
		condition: z.number().openapi({
			description: "Condition of the item (0-based index)",
		}),
		//
		age: z.number().openapi({
			description: "Age of the item (0-based index)",
		}),
		//
		locationId: z.string().openapi({
			description: "ID of the location",
		}),
		categoryId: z.string().openapi({
			description: "ID of the category",
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
		description: z.string().nullish().openapi({
			description: "Description of the item",
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

export type ListingDbSchema = typeof ListingDbSchema;

export namespace ListingDbSchema {
	export type Type = z.infer<ListingDbSchema>;
}
