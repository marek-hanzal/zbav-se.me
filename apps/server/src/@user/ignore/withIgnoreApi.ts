import type { Routes } from "~/hono/Routes";
import { withCollectionApi } from "./collection";
import { withCountApi } from "./count";
import { withToggleApi } from "./toggle";

export const withIgnoreApi: Routes.Fn = (routes) => {
	withCollectionApi(routes);
	withCountApi(routes);
	withToggleApi(routes);
};
