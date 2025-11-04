import type { Routes } from "../../hono/Routes";
import { withCategoryCollectionApi } from "./category-collection";
import { withCategoryCountApi } from "./category-count";
import { withCategoryFetchApi } from "./category-fetch";

export const withCategoryApi: Routes.Fn = (routes) => {
	withCategoryFetchApi(routes);
	withCategoryCollectionApi(routes);
	withCategoryCountApi(routes);
};
