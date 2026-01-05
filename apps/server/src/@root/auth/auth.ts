import { auth } from "~/auth/auth";
import { dialect } from "~/database/dialect";
import type { Routes } from "~/hono/Routes";

export const withAuthEndpoint: Routes.Fn = async ({ root }) => {
	const { handler } = await auth(async () => dialect);

	root.on(
		[
			"POST",
			"GET",
		],
		"/api/auth/*",
		(c) => handler(c.req.raw),
	);
};
