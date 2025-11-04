import type { Routes } from "../hono/Routes";
import { withCategoryCollectionApi } from "./endpoint/category-collection";
import { withCategoryCountApi } from "./endpoint/category-count";
import { withCategoryFetchApi } from "./endpoint/category-fetch";

export const withCategoryApi: Routes.Fn = (routes) => {
	withCategoryFetchApi(routes);
	withCategoryCollectionApi(routes);
	withCategoryCountApi(routes);
};
