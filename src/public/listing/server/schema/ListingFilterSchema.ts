import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const ListingFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		categoryId: z.string().min(1, "Category ID is required").optional().meta({
			id: "PublicCategoryId",
			description: "ID of the category",
		}),
		categoryIdIn: z
			.array(z.string().min(1, "Category ID is required"))
			.optional()
			.meta({
				id: "PublicCategoryIdIn",
				description: "Filter listings based on the provided category IDs",
			})
			.optional(),
		expiresAtBefore: z.coerce.date().optional().meta({
			description: "This filter matches listings that expire before the provided date",
			type: "string",
		}),
		expiresAtAfter: z.coerce.date().optional().meta({
			description: "This filter matches listings that expire after the provided date",
			type: "string",
		}),
	})
	.strip()
	.meta({
		id: "PublicListingFilter",
		description: "Public listing filters",
	});

export type ListingFilterSchema = typeof ListingFilterSchema;

export namespace ListingFilterSchema {
	export type Type = z.infer<ListingFilterSchema>;
}
