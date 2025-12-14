import type { Routes } from "~/hono/Routes";
import { withCollectionApi } from "./collection";
import { withCountApi } from "./count";
import { withCreateApi } from "./create";
import { withFetchApi } from "./fetch";
import { withPatchApi } from "./patch";

export const withDraftApi: Routes.Fn = (routes) => {
	withCollectionApi(routes);
	withCountApi(routes);
	withCreateApi(routes);
	withFetchApi(routes);
	withPatchApi(routes);
};
