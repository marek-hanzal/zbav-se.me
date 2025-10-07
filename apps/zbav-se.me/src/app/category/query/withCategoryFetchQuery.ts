import { withQuery } from "@use-pico/client";
import type { CategoryQuerySchema } from "~/app/category/db/CategoryQuerySchema";
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import { client } from "~/app/trpc/client/trpc";

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
			return client.category.fetch.query(data);
		},
	});
};
