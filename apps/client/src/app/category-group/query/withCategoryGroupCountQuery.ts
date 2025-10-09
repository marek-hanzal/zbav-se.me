import { withQuery } from "@use-pico/client";
import type { CountSchema } from "@use-pico/common";
import type { CategoryGroupQuerySchema } from "~/app/category-group/db/CategoryGroupQuerySchema";
import { client } from "~/app/trpc/client/trpc";

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
			return client.categoryGroup.count.query(data);
		},
	});
};
