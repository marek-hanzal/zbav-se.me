import type { Routes } from "~/hono/Routes";
import { withCorsProxyApi } from "./cors-proxy";

export const withCorsApi: Routes.Fn = async (routes) => {
	await withCorsProxyApi(routes);
};
