import type { Routes } from "~/hono/Routes";
import { withCollectionApi } from "./collection";
import { withCountApi } from "./count";
import { withCreateApi } from "./create";
import { withDeleteApi } from "./delete";
import { withFetchApi } from "./fetch";
import { withGalleryCreateApi } from "./gallery-create";
import { withPatchApi } from "./patch";

export const withDraftApi: Routes.Fn = (routes) => {
	withCollectionApi(routes);
	withCountApi(routes);
	withCreateApi(routes);
	withDeleteApi(routes);
	withFetchApi(routes);
	withGalleryCreateApi(routes);
	withPatchApi(routes);
};
