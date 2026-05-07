import { z } from "zod";

export const CategorySpotlightTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the category spotlight entry",
		}),
		categoryId: z.string().meta({
			description: "ID of the category this spotlight belongs to",
		}),
		text: z.string().meta({
			description: "Spotlight text content",
		}),
		locale: z.string().meta({
			description: "Locale/language of the spotlight text",
		}),
		weight: z.number().meta({
			description: "Weight/priority of this spotlight entry",
		}),
	})
	.meta({
		id: "CategorySpotlightTable",
		description: "Database row for a category spotlight entry.",
	})
	.strip();

export type CategorySpotlightTableSchema = typeof CategorySpotlightTableSchema;

export namespace CategorySpotlightTableSchema {
	export type Type = z.infer<CategorySpotlightTableSchema>;
}
