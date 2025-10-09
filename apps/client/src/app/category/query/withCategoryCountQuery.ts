import { withQuery } from "@use-pico/client";
import type { CountSchema } from "@use-pico/common";
import type { CategoryQuerySchema } from "~/app/category/db/CategoryQuerySchema";
import { client } from "~/app/trpc/client/trpc";

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
			return client.category.count.query(data);
		},
	});
};
