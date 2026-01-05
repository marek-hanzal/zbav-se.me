import type { Routes } from "~/hono/Routes";
import { withCollectionApi } from "./collection";
import { withCountApi } from "./count";
import { withCreateApi } from "./create";
import { withFetchApi } from "./fetch";

export const withUploadApi: Routes.Fn = async (routes) => {
	await withCreateApi(routes);
	await withFetchApi(routes);
	await withCollectionApi(routes);
	await withCountApi(routes);
};
