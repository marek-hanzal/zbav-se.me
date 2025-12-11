import type { Routes } from "~/hono/Routes";
import { withUserExPatchApi } from "./patch";

export const withUserExApi: Routes.Fn = (routes) => {
	withUserExPatchApi(routes);
};
