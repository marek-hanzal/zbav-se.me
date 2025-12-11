import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const FavouriteFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
		listingId: z.string().optional().openapi({
			description: "This filter matches the exact listingId",
		}),
	})
	.openapi("FavouriteFilter", {
		description: "Filter object for favourite collection",
	});

export type FavouriteFilterSchema = typeof FavouriteFilterSchema;

export namespace FavouriteFilterSchema {
	export type Type = z.infer<FavouriteFilterSchema>;
}
