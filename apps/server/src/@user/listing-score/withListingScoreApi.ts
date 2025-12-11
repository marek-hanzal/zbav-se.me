import type { Routes } from "~/hono/Routes";
import { withListingScoreCollectionApi } from "./listing-score-collection";
import { withListingScoreCountApi } from "./listing-score-count";
import { withListingScoreCreateApi } from "./listing-score-create";

export const withListingScoreApi: Routes.Fn = (routes) => {
	withListingScoreCollectionApi(routes);
	withListingScoreCountApi(routes);
	withListingScoreCreateApi(routes);
};
