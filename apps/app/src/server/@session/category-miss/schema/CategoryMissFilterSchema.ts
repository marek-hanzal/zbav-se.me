import { FilterSchema } from "@use-pico/common/schema";
import { z } from "zod";

export const CategoryMissFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		category: z
			.union([
				z.null(),
				z.string(),
			])
			.meta({
				description: "This filter matches the exact category name that was missed",
			}),
	})
	.strip()
	.meta({
		id: "CategoryMissFilter",
		description: "Filter object for category miss collection",
	});

export type CategoryMissFilterSchema = typeof CategoryMissFilterSchema;

export namespace CategoryMissFilterSchema {
	export type Type = z.infer<CategoryMissFilterSchema>;
}
