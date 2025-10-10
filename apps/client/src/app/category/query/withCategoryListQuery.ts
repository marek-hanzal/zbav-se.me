import { withQuery } from "@use-pico/client";
import type { CategoryQuerySchema, CategorySchema } from "@zbav-se.me/common";

export const withCategoryListQuery = () => {
	return withQuery<CategoryQuerySchema.Type, CategorySchema.Type[]>({
		keys(data) {
			return [
				"category",
				"list",
				data,
			];
		},
		async queryFn(data) {
			throw new Error("Not implemented");
		},
	});
};
