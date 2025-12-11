import type { Routes } from "~/hono/Routes";
import { withCollectionApi } from "./collection";
import { withCountApi } from "./count";
import { withCreateApi } from "./create";
import { withDeleteApi } from "./delete";
import { withFetchApi } from "./fetch";
import { withGalleryCreateApi } from "./gallery-create";
import { withPatchApi } from "./patch";

export const withFeedApi: Routes.Fn = (routes) => {
	withCreateApi(routes);
	withPatchApi(routes);
	withFetchApi(routes);
	withCollectionApi(routes);
	withCountApi(routes);
	withDeleteApi(routes);
	withGalleryCreateApi(routes);
};
