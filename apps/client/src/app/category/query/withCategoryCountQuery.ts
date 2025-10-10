import { withQuery } from "@use-pico/client";
import type { CountSchema } from "@use-pico/common";
import type { CategoryQuerySchema } from "@zbav-se.me/common";

export const withCategoryCountQuery = () => {
	return withQuery<CategoryQuerySchema.Type, CountSchema.Type>({
		keys(data) {
			return [
				"category",
				"count",
				data,
			];
		},
		async queryFn(data) {
			throw new Error("Not implemented");
		},
	});
};
