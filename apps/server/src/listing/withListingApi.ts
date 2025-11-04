import type { Routes } from "../hono/Routes";
import { withListingCollectionApi } from "./endpoint/listing-collection";
import { withListingCountApi } from "./endpoint/listing-count";
import { withListingCreateApi } from "./endpoint/listing-create";
import { withListingFeedCollectionApi } from "./endpoint/listing-feed-collection";
import { withListingFetchApi } from "./endpoint/listing-fetch";

export const withListingApi: Routes.Fn = (routes) => {
	withListingCreateApi(routes);
	withListingFeedCollectionApi(routes);
	withListingFetchApi(routes);
	withListingCollectionApi(routes);
	withListingCountApi(routes);
};
