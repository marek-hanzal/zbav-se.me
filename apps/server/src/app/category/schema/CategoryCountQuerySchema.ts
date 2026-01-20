import { z } from "@hono/zod-openapi";
import { CountEnumSchema } from "@use-pico/common/schema";
import { CategoryQuerySchema } from "./CategoryQuerySchema";

export const CategoryCountQuerySchema = z
	.looseObject({
		...CategoryQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
		count: CountEnumSchema.array().optional(),
	})
	.strip()
	.openapi("CategoryCountQuery", {
		description: "Query object for category count",
	});

export type CategoryCountQuerySchema = typeof CategoryCountQuerySchema;

export namespace CategoryCountQuerySchema {
	export type Type = z.infer<CategoryCountQuerySchema>;
}
