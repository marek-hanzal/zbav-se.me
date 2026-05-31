import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";

export const ListingWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
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
		visibleAtBefore: z.coerce.date().optional().meta({
			description:
				"This filter matches listings that become visible before the provided date",
			type: "string",
		}),
		visibleAtLte: z.coerce.date().optional().meta({
			description:
				"This filter matches listings that become visible on or before the provided date",
			type: "string",
		}),
		visibleAtAfter: z.coerce.date().optional().meta({
			description: "This filter matches listings that become visible after the provided date",
			type: "string",
		}),
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
		id: "PublicListingWhere",
		description: "Public listing filters",
	});

export type ListingWhereSchema = typeof ListingWhereSchema;

export namespace ListingWhereSchema {
	export type Type = z.infer<ListingWhereSchema>;
}
