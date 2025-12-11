import type { Routes } from "~/hono/Routes";
import { withListingCollectionApi } from "./collection";
import { withListingCountApi } from "./count";
import { withListingCreateApi } from "./create";
import { withListingFetchApi } from "./fetch";
import { withListingMetricsFetchApi } from "./metrics";

export const withListingApi: Routes.Fn = (routes) => {
	withListingCreateApi(routes);
	withListingFetchApi(routes);
	withListingCollectionApi(routes);
	withListingCountApi(routes);
	withListingMetricsFetchApi(routes);
};
