import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { withAuthMiddleware } from "~/server/middleware/withAuthMiddleware";

export const withUserMiddleware = createMiddleware()
	.middleware([
		withAuthMiddleware,
	])
	.server(async ({ request, next, context: { auth } }) => {
		const data = await auth.api.getSession({
			headers: request.headers,
		});

		if (!data?.user) {
			return redirect({
				to: "/redirect/sign-in",
			});
		}

		return next({
			context: {
				user: data.user,
			},
		});
	});
