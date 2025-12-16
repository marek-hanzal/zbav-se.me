import { auth } from "~/auth/auth";
import type { Routes } from "~/hono/Routes";

export const withAuthEndpoint: Routes.Fn = ({ root }) => {
	root.on(
		[
			"POST",
			"GET",
		],
		"/api/auth/*",
		(c) => auth.handler(c.req.raw),
	);
};
