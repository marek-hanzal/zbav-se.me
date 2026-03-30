import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const FavouriteFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().meta({
			description: "This filter matches the exact listingId",
		}),
	})
	.strip()
	.meta({
		id: "FavouriteFilter",
		description: "Filter object for favourite collection",
	});

export type FavouriteFilterSchema = typeof FavouriteFilterSchema;

export namespace FavouriteFilterSchema {
	export type Type = z.infer<FavouriteFilterSchema>;
}
