import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const FavouriteSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("FavouriteSortField", {
				description: "Field of the favourite sort",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("FavouriteSort", {
		description: "Sort object for favourite collection",
	});

export type FavouriteSortSchema = typeof FavouriteSortSchema;

export namespace FavouriteSortSchema {
	export type Type = z.infer<FavouriteSortSchema>;
}
