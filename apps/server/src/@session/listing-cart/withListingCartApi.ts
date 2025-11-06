import type { Routes } from "../../hono/Routes";
import { withListingCartCollectionApi } from "./listing-cart-collection";
import { withListingCartCountApi } from "./listing-cart-count";
import { withListingCartToggleApi } from "./listing-cart-toggle";

export const withListingCartApi: Routes.Fn = (routes) => {
	withListingCartCollectionApi(routes);
	withListingCartCountApi(routes);
	withListingCartToggleApi(routes);
};
