import type { Routes } from "../../hono/Routes";
import { withIgnoreCollectionApi } from "./ignore-collection";
import { withIgnoreCountApi } from "./ignore-count";
import { withIgnoreToggleApi } from "./ignore-toggle";

export const withIgnoreApi: Routes.Fn = (routes) => {
	withIgnoreCollectionApi(routes);
	withIgnoreCountApi(routes);
	withIgnoreToggleApi(routes);
};
