import { withContext } from "@logtape/logtape";
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { withAuthMiddleware } from "~/server/middleware/withAuthMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";

export const withUserMiddleware = createMiddleware()
	.middleware([
		withLogMiddleware,
		withAuthMiddleware,
	])
	.server(async ({ request, next, context: { auth, rootLogger } }) => {
		const logger = rootLogger.getChild([
			"middleware",
			"withUserMiddleware",
		]);

		const data = await auth.api.getSession({
			headers: request.headers,
		});

		if (!data?.user) {
			logger.warn("Access to protected resource!", {
				security: "middle",
			});

			return redirect({
				to: "/redirect/sign-in",
			});
		}

		const context = {
			userId: data.user.id,
		} as const;

		return withContext(context, async () => {
			return next({
				context: {
					user: data.user,
					rootLogger: rootLogger.with(context),
				},
			});
		});
	});
