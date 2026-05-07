import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { categoryAttrOfFn } from "../fn/categoryAttrOfFn";

export namespace withCategoryAttrOfQuery {
	export interface Data {
		categoryId: string;
	}
}

export const withCategoryAttrOfQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withCategoryAttrOfQuery",
	]),
	errors: {} as {
		query: categoryAttrOfFn.Error;
	},
	keys(data: withCategoryAttrOfQuery.Data) {
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
