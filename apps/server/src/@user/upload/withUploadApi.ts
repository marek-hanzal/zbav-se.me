import type { Routes } from "~/hono/Routes";
import { withUploadCollectionApi } from "./collection";
import { withUploadCountApi } from "./count";
import { withUploadCreateApi } from "./create";
import { withUploadFetchApi } from "./fetch";

export const withUploadApi: Routes.Fn = (routes) => {
	withUploadCreateApi(routes);
	withUploadFetchApi(routes);
	withUploadCollectionApi(routes);
	withUploadCountApi(routes);
};
