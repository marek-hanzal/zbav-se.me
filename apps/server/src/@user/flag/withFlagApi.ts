import type { Routes } from "~/hono/Routes";
import { withFlagCollectionApi } from "./collection";
import { withFlagCountApi } from "./count";
import { withFlagToggleApi } from "./toggle";

export const withFlagApi: Routes.Fn = (routes) => {
	withFlagCollectionApi(routes);
	withFlagCountApi(routes);
	withFlagToggleApi(routes);
};
