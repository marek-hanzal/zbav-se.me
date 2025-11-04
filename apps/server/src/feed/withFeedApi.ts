import type { Routes } from "../hono/Routes";
import { withFeedCollectionApi } from "./endpoint/feed-collection";
import { withFeedCountApi } from "./endpoint/feed-count";
import { withFeedCreateApi } from "./endpoint/feed-create";
import { withFeedDeleteApi } from "./endpoint/feed-delete";
import { withFeedFetchApi } from "./endpoint/feed-fetch";
import { withFeedPatchApi } from "./endpoint/feed-patch";

export const withFeedApi: Routes.Fn = (routes) => {
	withFeedCreateApi(routes);
	withFeedPatchApi(routes);
	withFeedFetchApi(routes);
	withFeedCollectionApi(routes);
	withFeedCountApi(routes);
	withFeedDeleteApi(routes);
};
