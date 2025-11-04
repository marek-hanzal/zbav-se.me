import type { Routes } from "../../../hono/Routes";
import { withCorsProxyApi } from "./cors-proxy/cors-proxy";

export const withCorsApi: Routes.Fn = (routes) => {
	withCorsProxyApi(routes);
};
