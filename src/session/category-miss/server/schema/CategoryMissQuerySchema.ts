import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { CategoryMissFilterSchema } from "~/session/category-miss/server/schema/CategoryMissFilterSchema";
import { CategoryMissSortSchema } from "~/session/category-miss/server/schema/CategoryMissSortSchema";
import { CategoryMissWhereSchema } from "~/session/category-miss/server/schema/CategoryMissWhereSchema";

export const CategoryMissQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: CategoryMissFilterSchema.optional(),
		where: CategoryMissWhereSchema.optional(),
		sort: CategoryMissSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "CategoryMissQuery",
		description: "Query object for category miss collection",
	});

export type CategoryMissQuerySchema = typeof CategoryMissQuerySchema;

export namespace CategoryMissQuerySchema {
	export type Type = z.infer<CategoryMissQuerySchema>;
}
