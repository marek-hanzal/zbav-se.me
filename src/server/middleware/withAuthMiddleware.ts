import { getLogger } from "@logtape/logtape";
import { createMiddleware } from "@tanstack/react-start";
import { auth } from "~/server/auth/auth";
import { withDialectMiddleware } from "~/server/middleware/withDialectMiddleware";

const logger = getLogger([
	"zbav-se.me",
	"withAuthMiddleware",
]);

const authMap = new Map<string, auth>();

export const withAuthMiddleware = createMiddleware()
	.middleware([
		withDialectMiddleware,
	])
	.server(async ({ next, context: { dialect, dsn } }) => {
		let instance = authMap.get(dsn);

		if (!instance) {
			logger.debug`Creating auth instance for ${dsn}`;

			instance = auth(() => dialect);
			authMap.set(dsn, instance);
		}

		return next({
			context: {
				auth: instance,
			},
		});
	});
