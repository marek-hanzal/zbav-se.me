import type { Routes } from "~/hono/Routes";
import { withCreateApi } from "./create";

export const withFeedbackApi: Routes.Fn = async (routes) => {
	await withCreateApi(routes);
};
