import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const CategoryFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		group: z.string().optional().meta({
			description: "This filter matches the exact group of the category",
		}),
		category: z.string().optional().meta({
			description: "This filter matches the exact category name",
		}),
		locale: z.string().optional().meta({
			description: "This filter matches the exact locale of the category",
		}),
		localeIn: z.array(z.string()).optional().meta({
			description: "This filter matches categories with locales in the provided array",
		}),
		slug: z.string().optional().meta({
			description: "This filter matches the exact slug of the category",
		}),
	})
	.strip()
	.meta({
		id: "PublicCategoryFilter",
		description: "Filter object for public category collection",
	});

export type CategoryFilterSchema = typeof CategoryFilterSchema;

export namespace CategoryFilterSchema {
	export type Type = z.infer<CategoryFilterSchema>;
}
