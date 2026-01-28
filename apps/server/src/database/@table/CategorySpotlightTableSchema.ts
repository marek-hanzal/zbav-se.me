import { z } from "@hono/zod-openapi";

export const CategorySpotlightTableSchema = z.object({
	id: z.string().openapi({
		description: "ID of the category spotlight entry",
	}),
	categoryId: z.string().openapi({
		description: "ID of the category this spotlight belongs to",
	}),
	text: z.string().openapi({
		description: "Spotlight text content",
	}),
	locale: z.string().openapi({
		description: "Locale/language of the spotlight text",
	}),
	weight: z.number().openapi({
		description: "Weight/priority of this spotlight entry",
	}),
});

export type CategorySpotlightTableSchema = typeof CategorySpotlightTableSchema;

export namespace CategorySpotlightTableSchema {
	export type Type = z.infer<CategorySpotlightTableSchema>;
}
