import type { Routes } from "~/hono/Routes";
import { withFavouriteCollectionApi } from "./collection";
import { withFavouriteCountApi } from "./count";
import { withFavouriteToggleApi } from "./toggle";

export const withFavouriteApi: Routes.Fn = (routes) => {
	withFavouriteCollectionApi(routes);
	withFavouriteCountApi(routes);
	withFavouriteToggleApi(routes);
};
