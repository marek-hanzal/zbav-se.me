import type { Routes } from "~/hono/Routes";
import { withListingCartFeedCollectionApi } from "./listing-cart-feed-collection";

export const withListingCartFeedApi: Routes.Fn = (routes) => {
	withListingCartFeedCollectionApi(routes);
};
