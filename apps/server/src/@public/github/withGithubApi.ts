import type { Routes } from "~/hono/Routes";
import { withHistoryApi } from "./history";

export const withGithubApi: Routes.Fn = (routes) => {
	withHistoryApi(routes);
};
