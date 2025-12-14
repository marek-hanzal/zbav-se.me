import { z } from "@hono/zod-openapi";
import { CurrencyListEnumSchema } from "~/schema/CurrencyListEnumSchema";

export const DraftDbSchema = z
	.object({
		id: z.string().openapi({
			description: "ID of the draft",
		}),
		userId: z.string().openapi({
			description: "ID of the user who created the draft",
		}),
		//
		price: z
			.union([
				z.coerce.number(),
				z.null(),
			])
			.openapi({
				description: "Price of the draft",
			}),
		//
		currency: z
			.union([
				CurrencyListEnumSchema,
				z.null(),
			])
			.openapi({
				description: "Currency of the draft",
			}),
		//
		condition: z
			.union([
				z.number(),
				z.null(),
			])
			.openapi({
				description: "Condition of the item (0-based index)",
			}),
		//
		age: z
			.union([
				z.number(),
				z.null(),
			])
			.openapi({
				description: "Age of the item (0-based index)",
			}),
		//
		locationId: z
			.union([
				z.string(),
				z.null(),
			])
			.openapi({
				description: "ID of the location",
			}),
		categoryId: z
			.union([
				z.string(),
				z.null(),
			])
			.openapi({
				description: "ID of the category",
			}),
		expiresAt: z
			.union([
				z.coerce.date(),
				z.null(),
			])
			.openapi({
				description: "Expiration timestamp",
				type: "string",
			}),
		//
		title: z
			.union([
				z.string(),
				z.null(),
			])
			.openapi({
				description: "Title of the item",
			}),
		//
		description: z
			.union([
				z.string(),
				z.null(),
			])
			.openapi({
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
