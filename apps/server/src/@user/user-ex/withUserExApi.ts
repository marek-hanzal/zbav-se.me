import type { Routes } from "~/hono/Routes";
import { withPatchApi } from "./patch";

export const withUserExApi: Routes.Fn = (routes) => {
	withPatchApi(routes);
};
