import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { CategoryFilterSchema } from "~/user/category/server/schema/CategoryFilterSchema";
import { CategorySortSchema } from "~/user/category/server/schema/CategorySortSchema";
import { CategoryWhereSchema } from "~/user/category/server/schema/CategoryWhereSchema";

export const CategoryQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: CategoryFilterSchema.optional(),
		where: CategoryWhereSchema.optional(),
		sort: CategorySortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "CategoryQuery",
		description: "Category query parameters",
	});

export type CategoryQuerySchema = typeof CategoryQuerySchema;

export namespace CategoryQuerySchema {
	export type Type = z.infer<CategoryQuerySchema>;
}
