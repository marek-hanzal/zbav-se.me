import type { Routes } from "~/hono/Routes";
import { withGalleryCollectionApi } from "./gallery-collection";
import { withGalleryCountApi } from "./gallery-count";
import { withGalleryFetchApi } from "./gallery-fetch";

export const withGalleryApi: Routes.Fn = (routes) => {
	withGalleryFetchApi(routes);
	withGalleryCollectionApi(routes);
	withGalleryCountApi(routes);
};
