import type { Routes } from "~/hono/Routes";
import { withMessageCreateApi } from "./message-create";

export const withMessageApi: Routes.Fn = (routes) => {
	withMessageCreateApi(routes);
};
