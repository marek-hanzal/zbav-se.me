import type { Routes } from "~/hono/Routes";
import { withFeedCollectionApi } from "./collection";
import { withFeedCountApi } from "./count";
import { withFeedCreateApi } from "./create";
import { withFeedDeleteApi } from "./delete";
import { withFeedFetchApi } from "./fetch";
import { withFeedGalleryCreateApi } from "./gallery-create";
import { withFeedPatchApi } from "./patch";

export const withFeedApi: Routes.Fn = (routes) => {
	withFeedCreateApi(routes);
	withFeedPatchApi(routes);
	withFeedFetchApi(routes);
	withFeedCollectionApi(routes);
	withFeedCountApi(routes);
	withFeedDeleteApi(routes);
	withFeedGalleryCreateApi(routes);
};
