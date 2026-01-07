import type { Routes } from "~/hono/Routes";
import { withUploadFetchApi } from "./fetch";

export const withUploadApi: Routes.Fn = async (routes) => {
	await withUploadFetchApi(routes);
};
