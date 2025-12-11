import type { Routes } from "~/hono/Routes";
import { withTransactionGalleryCreateApi } from "./transaction-gallery-create";

export const withTransactionGalleryApi: Routes.Fn = (routes) => {
	withTransactionGalleryCreateApi(routes);
};
