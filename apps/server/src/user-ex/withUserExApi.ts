import type { Routes } from "../hono/Routes";
import { withUserExPatchApi } from "./endpoint/user-ex-patch";

export const withUserExApi: Routes.Fn = (routes) => {
	withUserExPatchApi(routes);
};
