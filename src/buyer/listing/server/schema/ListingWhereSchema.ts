import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { DeliveryEnumSchema } from "~/common/delivery/enum/DeliveryEnumSchema";

export const ListingWhereSchema = z
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
		conditionIn: z.array(z.number()).optional().meta({
			description: "Filter listings based on the provided conditions (e.g. new, used, etc.)",
		}),
		ageIn: z.array(z.number()).optional().meta({
			description:
				"Filter listings based on the provided age groups (e.g. baby, toddler, etc.)",
		}),
		deliveryIn: z.array(DeliveryEnumSchema).optional().meta({
			description: "Filter listings based on the provided delivery options",
		}),
		//
		expiresAtBefore: z.coerce.date().optional().meta({
			description: "This filter matches listings that expire before the provided date",
			type: "string",
		}),
		expiresAtAfter: z.coerce.date().optional().meta({
			description: "This filter matches listings that expire after the provided date",
			type: "string",
		}),
		//
		range: z.number().optional().meta({
			description:
				"This filter matches listings that are within the specified range (in kilometers) from the user's location; needs 'meta.locationId'",
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

export type ListingWhereSchema = typeof ListingWhereSchema;

export namespace ListingWhereSchema {
	export type Type = z.infer<ListingWhereSchema>;
}
