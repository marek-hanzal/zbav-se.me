import type { Routes } from "~/hono/Routes";
import { withBuyerApi } from "./buyer";
import { withSellerApi } from "./seller";

export const withUserEventApi: Routes.Fn = (routes) => {
	withBuyerApi(routes);
	withSellerApi(routes);
};
