import { withQuery } from "@use-pico/client";
import type { CategoryQuerySchema, CategorySchema } from "@zbav-se.me/common";

export const withCategoryFetchQuery = () => {
	return withQuery<CategoryQuerySchema.Type, CategorySchema.Type>({
		keys(data) {
			return [
				"category",
				"fetch",
				data,
			];
		},
		async queryFn(data) {
			throw new Error("Not implemented");
		},
	});
};
