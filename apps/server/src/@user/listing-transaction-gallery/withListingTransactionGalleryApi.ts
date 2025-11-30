import type { Routes } from "~/hono/Routes";
import { withListingTransactionGalleryCreateApi } from "./listing-transaction-gallery-create";

export const withListingTransactionGalleryApi: Routes.Fn = (routes) => {
	withListingTransactionGalleryCreateApi(routes);
};
