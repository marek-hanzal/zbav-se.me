import type { Routes } from "~/hono/Routes";
import { withFeedFavouriteCollectionApi } from "./feed-favourite-collection";

export const withFeedFavouriteApi: Routes.Fn = async (routes) => {
	await withFeedFavouriteCollectionApi(routes);
};
