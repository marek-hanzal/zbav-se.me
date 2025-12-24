import type { Routes } from "~/hono/Routes";
import { withCreateApi } from "./create";

export const withTransactionMessageGalleryApi: Routes.Fn = (routes) => {
	withCreateApi(routes);
};
