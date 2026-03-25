import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/common/schema/OrderEnumSchema";

export const FavouriteSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("FavouriteSortField", {
				description: "Field of the favourite sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.openapi("FavouriteSort", {
		description: "Sort object for favourite collection",
	});

export type FavouriteSortSchema = typeof FavouriteSortSchema;

export namespace FavouriteSortSchema {
	export type Type = z.infer<FavouriteSortSchema>;
}
