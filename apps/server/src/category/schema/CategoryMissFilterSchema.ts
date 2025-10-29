import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "../../schema/DefaultFilterSchema";

export const CategoryMissFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		category: z.string().nullish().openapi({
			description:
				"This filter matches the exact category name that was missed",
		}),
	})
	.openapi("CategoryMissFilter", {
		description: "User-land filters for category miss tracking",
	});

export type CategoryMissFilterSchema = typeof CategoryMissFilterSchema;

export namespace CategoryMissFilterSchema {
	export type Type = z.infer<CategoryMissFilterSchema>;
}
