import { FilterSchema } from "@use-pico/common/schema";
import { z } from "zod";

export const ListingFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
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
