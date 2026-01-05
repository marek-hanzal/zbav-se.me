import type { Routes } from "~/hono/Routes";
import { withCollectionApi } from "./collection";
import { withCountApi } from "./count";
import { withFetchApi } from "./fetch";

export const withGalleryApi: Routes.Fn = async (routes) => {
	await withFetchApi(routes);
	await withCollectionApi(routes);
	await withCountApi(routes);
};
