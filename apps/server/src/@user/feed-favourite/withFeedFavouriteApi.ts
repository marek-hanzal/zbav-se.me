import { withFeedFavouriteCollectionApi } from "~/@user/feed-favourite/collection";
import type { Routes } from "~/hono/Routes";

export const withFeedFavouriteApi: Routes.Fn = async (routes) => {
	await withFeedFavouriteCollectionApi(routes);
};
