import type { Routes } from "~/hono/Routes";
import { withIgnoreCollectionApi } from "./collection";
import { withIgnoreCountApi } from "./count";
import { withIgnoreToggleApi } from "./toggle";

export const withIgnoreApi: Routes.Fn = (routes) => {
	withIgnoreCollectionApi(routes);
	withIgnoreCountApi(routes);
	withIgnoreToggleApi(routes);
};
