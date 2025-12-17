import type { Routes } from "~/hono/Routes";
import { withMessageCollectionApi } from "./message/collection";

export const withMessageThreadApi: Routes.Fn = (routes) => {
	withMessageCollectionApi(routes);
};
