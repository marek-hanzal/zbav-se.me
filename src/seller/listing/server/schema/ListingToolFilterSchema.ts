import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const ListingToolFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		updatedAtGte: z.iso.datetime().optional().meta({
			description:
				"This filter matches listings with updatedAt greater than or equal to the provided date",
		}),
		updatedAtLte: z.iso.datetime().optional().meta({
			description:
				"This filter matches listings with updatedAt less than or equal to the provided date",
		}),
	})
	.strip();

export type ListingToolFilterSchema = typeof ListingToolFilterSchema;

export namespace ListingToolFilterSchema {
	export type Type = z.infer<ListingToolFilterSchema>;
}
