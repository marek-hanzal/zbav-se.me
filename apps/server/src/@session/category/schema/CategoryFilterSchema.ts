import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const CategoryFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		group: z.string().optional().openapi({
			description: "This filter matches the exact group of the category",
		}),
		category: z.string().optional().openapi({
			description: "This filter matches the exact category name",
		}),
		locale: z.string().optional().openapi({
			description: "This filter matches the exact locale of the category",
		}),
		localeIn: z.array(z.string()).optional().openapi({
			description: "This filter matches categories with locales in the provided array",
		}),
	})
	.openapi("CategoryFilter", {
		description: "Filter object for category collection",
	});

export type CategoryFilterSchema = typeof CategoryFilterSchema;

export namespace CategoryFilterSchema {
	export type Type = z.infer<CategoryFilterSchema>;
}
