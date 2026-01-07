import type { Routes } from "~/hono/Routes";
import { withCategoryCollectionApi } from "./collection";
import { withCategoryCountApi } from "./count";
import { withCategoryFetchApi } from "./fetch";

export const withCategoryApi: Routes.Fn = async (routes) => {
	await withCategoryFetchApi(routes);
	await withCategoryCollectionApi(routes);
	await withCategoryCountApi(routes);
};
