import type { Routes } from "~/hono/Routes";
import { withCollectionApi } from "./collection";
import { withCountApi } from "./count";
import { withCreateApi } from "./create";

export const withListingScoreApi: Routes.Fn = (routes) => {
	withCollectionApi(routes);
	withCountApi(routes);
	withCreateApi(routes);
};
