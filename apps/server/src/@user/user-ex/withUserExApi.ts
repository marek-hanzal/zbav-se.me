import type { Routes } from "~/hono/Routes";
import { withUserExPatchApi } from "./user-ex-patch";

export const withUserExApi: Routes.Fn = (routes) => {
	withUserExPatchApi(routes);
};
