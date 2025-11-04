import type { Routes } from "../../hono/Routes";
import { withUploadCollectionApi } from "./upload-collection";
import { withUploadCountApi } from "./upload-count";
import { withUploadCreateApi } from "./upload-create";
import { withUploadFetchApi } from "./upload-fetch";

export const withUploadApi: Routes.Fn = (routes) => {
	withUploadCreateApi(routes);
	withUploadFetchApi(routes);
	withUploadCollectionApi(routes);
	withUploadCountApi(routes);
};
