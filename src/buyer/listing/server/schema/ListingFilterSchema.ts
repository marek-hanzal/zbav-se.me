import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const ListingFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "ID of the user; does not have an effect on API endpoints",
		}),
		categoryId: z.string().min(1, "Category ID is required").optional().meta({
			id: "CategoryId",
			description: "ID of the category",
		}),
		categoryIdIn: z
			.array(z.string().min(1, "Category ID is required"))
			.optional()
			.meta({
				id: "CategoryIdIn",
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
		//
		withOwn: z.boolean().optional().meta({
			description: "This filter matches listings with the user's own listings",
		}),
		my: z.boolean().optional().meta({
			description: "Return exclusively user's listings when set to true",
		}),
		withIgnored: z.boolean().optional().meta({
			description: "Include ignored listings",
		}),
		isFavourite: z.boolean().optional().meta({
			description: "Show listing that are in the user's favourites",
		}),
	})
	.strip()
	.meta({
		id: "ListingFilter",
		description: "User-land filters",
	});

export type ListingFilterSchema = typeof ListingFilterSchema;

export namespace ListingFilterSchema {
	export type Type = z.infer<ListingFilterSchema>;
}
