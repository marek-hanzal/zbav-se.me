import type { Routes } from "~/hono/Routes";
import { withFlagCollectionApi } from "./flag-collection";
import { withFlagCountApi } from "./flag-count";
import { withFlagToggleApi } from "./flag-toggle";

export const withFlagApi: Routes.Fn = (routes) => {
	withFlagCollectionApi(routes);
	withFlagCountApi(routes);
	withFlagToggleApi(routes);
};
