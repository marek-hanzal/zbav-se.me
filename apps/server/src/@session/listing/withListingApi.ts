import type { Routes } from "../../hono/Routes";
import { withListingCollectionApi } from "./listing-collection";
import { withListingCountApi } from "./listing-count";
import { withListingCreateApi } from "./listing-create";
import { withListingFetchApi } from "./listing-fetch";
import { withListingScoreFetchApi } from "./listing-score";

export const withListingApi: Routes.Fn = (routes) => {
	withListingCreateApi(routes);
	withListingFetchApi(routes);
	withListingCollectionApi(routes);
	withListingCountApi(routes);
	withListingScoreFetchApi(routes);
};
