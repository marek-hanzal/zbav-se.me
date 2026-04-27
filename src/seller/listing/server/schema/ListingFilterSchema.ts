import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { ListingStatusEnumSchema } from "~/common/listing/enum/ListingStatusEnumSchema";

export const ListingFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		status: ListingStatusEnumSchema.optional(),
		userId: z.string().optional().meta({
			description: "ID of the user; does not have an effect on API endpoints",
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
