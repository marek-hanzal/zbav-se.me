import type { Routes } from "../../hono/Routes";
import { withCategoryCartCollectionApi } from "./category-cart-collection";

export const withCategoryCartApi: Routes.Fn = (routes) => {
	withCategoryCartCollectionApi(routes);
};
