import type { Routes } from "~/hono/Routes";
import { withCreateApi } from "./create";

export const withFeedbackApi: Routes.Fn = (routes) => {
	withCreateApi(routes);
};
