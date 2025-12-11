import type { Routes } from "~/hono/Routes";
import { withS3PresignApi } from "./presign";

export const withS3Api: Routes.Fn = (routes) => {
	withS3PresignApi(routes);
};
