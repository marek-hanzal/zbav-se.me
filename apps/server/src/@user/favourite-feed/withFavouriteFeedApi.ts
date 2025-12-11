import type { Routes } from "~/hono/Routes";
import { withFavouriteFeedCollectionApi } from "./favourite-feed-collection";

export const withFavouriteFeedApi: Routes.Fn = (routes) => {
	withFavouriteFeedCollectionApi(routes);
};
