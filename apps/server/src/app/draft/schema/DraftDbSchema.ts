import { z } from "@hono/zod-openapi";
import { CurrencyListEnumSchema } from "~/schema/CurrencyListEnumSchema";
import { VectorSchema } from "~/schema/VectorSchema";

export const DraftDbSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the draft",
		}),
		userId: z.string().openapi({
			description: "ID of the user who created the draft",
		}),
		//
		price: z.coerce.number().nullish().openapi({
			description: "Price of the draft",
			type: "number",
		}),
		//
		currency: CurrencyListEnumSchema.nullish(),
		//
		condition: z.number().nullish().openapi({
			description: "Condition of the item (0-based index)",
		}),
		//
		age: z.number().nullish().openapi({
			description: "Age of the item (0-based index)",
		}),
		//
		locationId: z.string().nullish().openapi({
			description: "ID of the location",
		}),
		categoryId: z.string().nullish().openapi({
			description: "ID of the category",
		}),
		expiresAt: z.coerce.date().nullish().openapi({
			description: "Expiration timestamp",
			type: "string",
		}),
		//
		title: z.string().nullish().openapi({
			description: "Title of the item",
		}),
		titleVec: VectorSchema.nullish().openapi({
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

export type DraftDbSchema = typeof DraftDbSchema;

export namespace DraftDbSchema {
	export type Type = z.infer<DraftDbSchema>;
}
