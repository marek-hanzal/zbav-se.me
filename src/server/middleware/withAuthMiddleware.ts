import { createMiddleware } from "@tanstack/react-start";
import { auth } from "~/server/auth/auth";
import { withDialectMiddleware } from "~/server/middleware/withDialectMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";

const authMap = new Map<string, auth>();

export const withAuthMiddleware = createMiddleware()
	.middleware([
		withLogMiddleware,
		withDialectMiddleware,
	])
	.server(async ({ next, context: { dialect, dsn, rootLogger } }) => {
		const logger = rootLogger.getChild([
			"middleware",
			"withAuthMiddleware",
		]);
		let instance = authMap.get(dsn);

		if (!instance) {
			logger.trace("Creating auth instance", {
				dsn,
			});

			instance = auth(() => dialect);
			authMap.set(dsn, instance);
		}

		return next({
			context: {
				auth: instance,
			},
		});
	});
