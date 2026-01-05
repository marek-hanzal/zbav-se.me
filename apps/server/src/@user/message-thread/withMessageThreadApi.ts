import type { Routes } from "~/hono/Routes";
import { withMessageCollectionApi } from "./message/collection";

export const withMessageThreadApi: Routes.Fn = async (routes) => {
	await withMessageCollectionApi(routes);
};
