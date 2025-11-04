import type { Routes } from "../hono/Routes";
import { withGalleryCollectionApi } from "./endpoint/gallery-collection";
import { withGalleryCountApi } from "./endpoint/gallery-count";
import { withGalleryFetchApi } from "./endpoint/gallery-fetch";

export const withGalleryApi: Routes.Fn = (routes) => {
	withGalleryFetchApi(routes);
	withGalleryCollectionApi(routes);
	withGalleryCountApi(routes);
};
