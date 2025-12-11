import type { Routes } from "~/hono/Routes";
import { withGalleryCollectionApi } from "./collection";
import { withGalleryCountApi } from "./count";
import { withGalleryFetchApi } from "./fetch";

export const withGalleryApi: Routes.Fn = (routes) => {
	withGalleryFetchApi(routes);
	withGalleryCollectionApi(routes);
	withGalleryCountApi(routes);
};
