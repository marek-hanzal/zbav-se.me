import type { Routes } from "../../hono/Routes";
import { withListingCollectionApi } from "./listing-collection";
import { withListingCountApi } from "./listing-count";
import { withListingCreateApi } from "./listing-create";
import { withListingFeedCollectionApi } from "./listing-feed-collection";
import { withListingFetchApi } from "./listing-fetch";

export const withListingApi: Routes.Fn = (routes) => {
	withListingCreateApi(routes);
	withListingFeedCollectionApi(routes);
	withListingFetchApi(routes);
	withListingCollectionApi(routes);
	withListingCountApi(routes);
};
