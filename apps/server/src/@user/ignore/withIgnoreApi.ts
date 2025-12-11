import type { Routes } from "../../hono/Routes";
import { withListingIgnoreCollectionApi } from "./listing-ignore-collection";
import { withListingIgnoreCountApi } from "./listing-ignore-count";
import { withListingIgnoreToggleApi } from "./listing-ignore-toggle";

export const withListingIgnoreApi: Routes.Fn = (routes) => {
	withListingIgnoreCollectionApi(routes);
	withListingIgnoreCountApi(routes);
	withListingIgnoreToggleApi(routes);
};
