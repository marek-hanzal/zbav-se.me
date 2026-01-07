import type { Routes } from "~/hono/Routes";
import { withSellerInfoApi } from "./seller-info";

export const withListingApi: Routes.Fn = async (routes) => {
	await withSellerInfoApi(routes);
};
