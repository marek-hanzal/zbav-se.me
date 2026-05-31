import { z } from "zod";
import { CategoryQuerySchema } from "~/public/category/server/schema/CategoryQuerySchema";

export const CategoryCountQuerySchema = z
	.looseObject({
		...CategoryQuerySchema.pick({
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "PublicCategoryCountQuery",
		description: "Query object for public category count",
	});

export type CategoryCountQuerySchema = typeof CategoryCountQuerySchema;

export namespace CategoryCountQuerySchema {
	export type Type = z.infer<CategoryCountQuerySchema>;
}
