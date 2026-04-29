import { withQuery } from "@/lib/client/query";
import type { EntitySchema } from "@/lib/common/schema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { categoryFieldsFn } from "../fn/categoryFieldsFn";

export const withCategoryFieldsQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withCategoryFieldsQuery",
	]),
	errors: {} as {
		query: categoryFieldsFn.Error;
	},
	keys(data: EntitySchema.Type) {
		return [
			"category-field",
			data,
		];
	},
	async queryFn(data: EntitySchema.Type) {
		return categoryFieldsFn({
			data,
		});
	},
});
