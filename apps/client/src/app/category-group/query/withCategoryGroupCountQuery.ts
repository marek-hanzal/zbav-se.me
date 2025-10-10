import { withQuery } from "@use-pico/client";
import type { CountSchema } from "@use-pico/common";
import type { CategoryGroupQuerySchema } from "@zbav-se.me/common";

export const withCategoryGroupCountQuery = () => {
	return withQuery<CategoryGroupQuerySchema.Type, CountSchema.Type>({
		keys(data) {
			return [
				"category-group",
				"count",
				data,
			];
		},
		async queryFn(data) {
			throw new Error("Not implemented");
		},
	});
};
