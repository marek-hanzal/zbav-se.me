import { z } from "zod";
import { CategorySortSchema } from "~/public-category/schema/CategorySortSchema";
import { CategoryWhereSchema } from "~/public-category/schema/CategoryWhereSchema";
import { CursorSchema } from "~/query/schema/CursorSchema";

export const CategoryQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		where: CategoryWhereSchema.optional(),
		sort: CategorySortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "PublicCategoryQuery",
		description: "Public category query parameters",
	});

export type CategoryQuerySchema = typeof CategoryQuerySchema;

export namespace CategoryQuerySchema {
	export type Type = z.infer<CategoryQuerySchema>;
}
