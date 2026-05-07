import { z } from "zod";
import { CategoryDiscoveryEnumSchema } from "~/common/category/enum/CategoryDiscoveryEnumSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";

export const CategoryTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the category",
		}),
		group: z.string().meta({
			description: "Group/name of the category",
		}),
		category: z.string().meta({
			description: "Category name within the group",
		}),
		slug: z.string().meta({
			description: "Slug of the category",
		}),
		sort: z.number().meta({
			description: "Sort order (position) of the category",
		}),
		locale: z.string().meta({
			description: "Locale/language of the category",
		}),
		discovery: CategoryDiscoveryEnumSchema.meta({
			description: `
Controls whether listings in this category are included in default listing queries.

Explicit categories are returned only when the query asks for a category using categoryId or categoryIdIn.
        `.trim(),
		}),
		restriction: RestrictionEnumSchema.meta({
			description: `
Restriction this category applies by default; it cannot be weakened, but from the other side it
may be hardened to higher restriction level.
        `.trim(),
		}),
	})
	.meta({
		id: "CategoryTable",
		description: "Database row for a category.",
	})
	.strip();

export type CategoryTableSchema = typeof CategoryTableSchema;

export namespace CategoryTableSchema {
	export type Type = z.infer<CategoryTableSchema>;
}
