import type { Routes } from "../hono/Routes";
import { withCorsProxyApi } from "./endpoint/cors-proxy";

export const withCorsApi: Routes.Fn = (routes) => {
	withCorsProxyApi(routes);
};
