import type { Routes } from "~/hono/Routes";
import { withBuyerApi } from "./buyer";
import { withSellerApi } from "./seller";

export const withUserEventApi: Routes.Fn = async (routes) => {
	await withBuyerApi(routes);
	await withSellerApi(routes);
};
