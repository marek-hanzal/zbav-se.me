import { withQuery } from "@use-pico/client";
import type { CategoryQuerySchema } from "~/app/category/db/CategoryQuerySchema";
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import { client } from "~/app/trpc/client/trpc";

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
			return client.category.list.query(data);
		},
	});
};
