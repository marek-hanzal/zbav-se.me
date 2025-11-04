import type { Routes } from "../../../hono/Routes";
import { withOriginEndpoint } from "./origin/origin";

export const withOriginApi: Routes.Fn = (routes) => {
	withOriginEndpoint(routes);
};
