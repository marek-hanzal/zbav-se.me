import type { Routes } from "~/hono/Routes";
import { withBuyerApi } from "./buyer";

export const withUserEventApi: Routes.Fn = (routes) => {
	withBuyerApi(routes);
};
