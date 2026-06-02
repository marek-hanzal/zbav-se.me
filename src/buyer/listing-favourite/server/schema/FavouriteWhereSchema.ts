import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";

export const FavouriteWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
		userId: z.string().optional().meta({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().meta({
			description: "This filter matches the exact listingId",
		}),
	})
	.strip()
	.meta({
		id: "FavouriteWhere",
		description: "App-based filters",
	});

export type FavouriteWhereSchema = typeof FavouriteWhereSchema;

export namespace FavouriteWhereSchema {
	export type Type = z.infer<FavouriteWhereSchema>;
}
