import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";

export const CategoryMissFilterSchema = z
	.looseObject({
		...WhereSchema.shape,
		category: z.string().nullable().meta({
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
