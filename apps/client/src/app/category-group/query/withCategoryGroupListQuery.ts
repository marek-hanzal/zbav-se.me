import { withQuery } from "@use-pico/client";
import type {
	CategoryGroupQuerySchema,
	CategoryGroupSchema,
} from "@zbav-se.me/common";

export const withCategoryGroupListQuery = () => {
	return withQuery<CategoryGroupQuerySchema.Type, CategoryGroupSchema.Type[]>(
		{
			keys(data) {
				return [
					"category-group",
					"list",
					data,
				];
			},
			async queryFn(data) {
				throw new Error("Not implemented");
			},
		},
	);
};
