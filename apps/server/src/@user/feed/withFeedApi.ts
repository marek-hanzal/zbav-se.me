import type { Routes } from "~/hono/Routes";
import { withCollectionApi } from "./collection";
import { withCountApi } from "./count";
import { withCreateApi } from "./create";
import { withDeleteApi } from "./delete";
import { withFetchApi } from "./fetch";
import { withGalleryCreateApi } from "./gallery-create";
import { withPatchApi } from "./patch";

export const withFeedApi: Routes.Fn = async (routes) => {
	await withCreateApi(routes);
	await withPatchApi(routes);
	await withFetchApi(routes);
	await withCollectionApi(routes);
	await withCountApi(routes);
	await withDeleteApi(routes);
	await withGalleryCreateApi(routes);
};
