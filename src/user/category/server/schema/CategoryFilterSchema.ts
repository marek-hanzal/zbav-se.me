import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";

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
		restrictionLte: RestrictionEnumSchema.optional().meta({
			description: "Filter out restricted categories",
		}),
		withRestriction: z.boolean().optional().meta({
			description: "If true, only categories available to the user will be returned",
		}),
	})
	.strip()
	.meta({
		id: "CategoryFilter",
		description: "Filter object for category collection",
	});

export type CategoryFilterSchema = typeof CategoryFilterSchema;

export namespace CategoryFilterSchema {
	export type Type = z.infer<CategoryFilterSchema>;
}
