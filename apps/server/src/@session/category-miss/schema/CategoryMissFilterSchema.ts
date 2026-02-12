import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const CategoryMissFilterSchema = z
	.looseObject({
		...DefaultFilterSchema.shape,
		category: z
			.union([
				z.null(),
				z.string(),
			])
			.openapi({
				description: "This filter matches the exact category name that was missed",
			}),
	})
	.strip()
	.openapi("CategoryMissFilter", {
		description: "Filter object for category miss collection",
	});

export type CategoryMissFilterSchema = typeof CategoryMissFilterSchema;

export namespace CategoryMissFilterSchema {
	export type Type = z.infer<CategoryMissFilterSchema>;
}
