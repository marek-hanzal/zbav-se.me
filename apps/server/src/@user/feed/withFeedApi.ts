import type { Routes } from "../../hono/Routes";
import { withFeedCollectionApi } from "./feed-collection";
import { withFeedCountApi } from "./feed-count";
import { withFeedCreateApi } from "./feed-create";
import { withFeedDeleteApi } from "./feed-delete";
import { withFeedFetchApi } from "./feed-fetch";
import { withFeedPatchApi } from "./feed-patch";

export const withFeedApi: Routes.Fn = (routes) => {
	withFeedCreateApi(routes);
	withFeedPatchApi(routes);
	withFeedFetchApi(routes);
	withFeedCollectionApi(routes);
	withFeedCountApi(routes);
	withFeedDeleteApi(routes);
};
