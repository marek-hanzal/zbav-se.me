import type { Routes } from "../../hono/Routes";
import { withListingFlagCollectionApi } from "./listing-flag-collection";
import { withListingFlagCountApi } from "./listing-flag-count";
import { withListingFlagToggleApi } from "./listing-flag-toggle";

export const withListingFlagApi: Routes.Fn = (routes) => {
	withListingFlagCollectionApi(routes);
	withListingFlagCountApi(routes);
	withListingFlagToggleApi(routes);
};
