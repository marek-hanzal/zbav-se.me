import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withQueryFn } from "~/query/fn/withQueryFn";
import { categoryAttrOfFn } from "~/user-category/fn/categoryAttrOfFn";

export namespace withCategoryAttrOfQuery {
	export interface Data {
		categoryId: string;
	}
}

export const withCategoryAttrOfQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withCategoryAttrOfQuery",
	]),
	errors: {} as {
		query: categoryAttrOfFn.Error;
	},
	keysFn(data: withCategoryAttrOfQuery.Data) {
		return [
			"category-attr-of",
			data,
		];
	},
	async queryFn(data: withCategoryAttrOfQuery.Data) {
		return categoryAttrOfFn({
			data,
		});
	},
});
