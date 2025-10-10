import { withQuery } from "@use-pico/client";
import type {
	CategoryGroupQuerySchema,
	CategoryGroupSchema,
} from "@zbav-se.me/common";

export const withCategoryGroupFetchQuery = () => {
	return withQuery<CategoryGroupQuerySchema.Type, CategoryGroupSchema.Type>({
		keys(data) {
			return [
				"category-group",
				"fetch",
				data,
			];
		},
		async queryFn(data) {
			throw new Error("Not implemented");
		},
	});
};
