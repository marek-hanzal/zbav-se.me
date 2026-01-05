import type { Routes } from "~/hono/Routes";
import { withPatchApi } from "./patch";

export const withUserExApi: Routes.Fn = async (routes) => {
	await withPatchApi(routes);
};
