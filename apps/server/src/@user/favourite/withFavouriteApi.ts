import type { Routes } from "~/hono/Routes";
import { withCollectionApi } from "./collection";
import { withCountApi } from "./count";
import { withToggleApi } from "./toggle";

export const withFavouriteApi: Routes.Fn = async (routes) => {
	await withCollectionApi(routes);
	await withCountApi(routes);
	await withToggleApi(routes);
};
