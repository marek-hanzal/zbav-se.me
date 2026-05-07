import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const FavouriteSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
			])
			.meta({
				id: "FavouriteSortField",
				description: "Field of the favourite sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "FavouriteSort",
		description: "Sort object for favourite collection",
	});

export type FavouriteSortSchema = typeof FavouriteSortSchema;

export namespace FavouriteSortSchema {
	export type Type = z.infer<FavouriteSortSchema>;
}
