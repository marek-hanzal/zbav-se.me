import { withQuery } from "@use-pico/client";
import type { CategoryGroupQuerySchema } from "~/app/category-group/db/CategoryGroupQuerySchema";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { client } from "~/app/trpc/client/trpc";

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
			return client.categoryGroup.fetch.query(data);
		},
	});
};
