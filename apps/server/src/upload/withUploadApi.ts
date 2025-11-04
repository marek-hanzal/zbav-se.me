import type { Routes } from "../hono/Routes";
import { withUploadCollectionApi } from "./endpoint/upload-collection";
import { withUploadCountApi } from "./endpoint/upload-count";
import { withUploadCreateApi } from "./endpoint/upload-create";
import { withUploadFetchApi } from "./endpoint/upload-fetch";

export const withUploadApi: Routes.Fn = (routes) => {
	withUploadCreateApi(routes);
	withUploadFetchApi(routes);
	withUploadCollectionApi(routes);
	withUploadCountApi(routes);
};
