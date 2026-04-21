import { z } from "zod";
import { ListingRestrictionEnumSchema } from "~/common/listing/enum/ListingRestrictionEnumSchema";

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
		restrictions: z.array(ListingRestrictionEnumSchema).meta({
			description: `
Array of restrictions applied using this category; this is core rule and it's not possible to override it by the user.

Empty array means "open" (unrestricted).
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
