import type { Routes } from "~/hono/Routes";
import { withPresignApi } from "./presign";

export const withS3Api: Routes.Fn = async (routes) => {
	await withPresignApi(routes);
};
