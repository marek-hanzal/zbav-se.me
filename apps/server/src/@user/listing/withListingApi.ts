import type { Routes } from "~/hono/Routes";
import { withCollectionApi } from "./collection";
import { withCountApi } from "./count";
import { withCreateApi } from "./create";
import { withFetchApi } from "./fetch";
import { withMetricsApi } from "./metrics";

export const withListingApi: Routes.Fn = (routes) => {
	withCreateApi(routes);
	withFetchApi(routes);
	withCollectionApi(routes);
	withCountApi(routes);
	withMetricsApi(routes);
};
