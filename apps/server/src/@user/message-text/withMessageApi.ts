import type { Routes } from "~/hono/Routes";
import { withMessageTextCreateApi } from "./message-create";

export const withMessageTextApi: Routes.Fn = (routes) => {
	withMessageTextCreateApi(routes);
};
