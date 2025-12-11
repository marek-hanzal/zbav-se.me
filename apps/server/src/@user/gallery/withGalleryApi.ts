import type { Routes } from "~/hono/Routes";
import { withCollectionApi } from "./collection";
import { withCountApi } from "./count";
import { withFetchApi } from "./fetch";

export const withGalleryApi: Routes.Fn = (routes) => {
	withFetchApi(routes);
	withCollectionApi(routes);
	withCountApi(routes);
};
