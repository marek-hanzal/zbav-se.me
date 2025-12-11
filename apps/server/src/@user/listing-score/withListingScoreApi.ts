import type { Routes } from "~/hono/Routes";
import { withListingScoreCollectionApi } from "./collection";
import { withListingScoreCountApi } from "./count";
import { withListingScoreCreateApi } from "./create";

export const withListingScoreApi: Routes.Fn = (routes) => {
	withListingScoreCollectionApi(routes);
	withListingScoreCountApi(routes);
	withListingScoreCreateApi(routes);
};
