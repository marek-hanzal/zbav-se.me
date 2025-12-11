import type { Routes } from "~/hono/Routes";
import { withFavouriteCollectionApi } from "./favourite-collection";
import { withFavouriteCountApi } from "./favourite-count";
import { withFavouriteToggleApi } from "./favourite-toggle";

export const withFavouriteApi: Routes.Fn = (routes) => {
	withFavouriteCollectionApi(routes);
	withFavouriteCountApi(routes);
	withFavouriteToggleApi(routes);
};
