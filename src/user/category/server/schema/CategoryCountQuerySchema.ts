import { z } from "zod";
import { CategoryQuerySchema } from "~/user/category/server/schema/CategoryQuerySchema";

export const CategoryCountQuerySchema = z
	.looseObject({
		...CategoryQuerySchema.pick({
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "CategoryCountQuery",
		description: "Query object for category count",
	});

export type CategoryCountQuerySchema = typeof CategoryCountQuerySchema;

export namespace CategoryCountQuerySchema {
	export type Type = z.infer<CategoryCountQuerySchema>;
}
