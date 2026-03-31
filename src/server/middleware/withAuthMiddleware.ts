import { createMiddleware } from "@tanstack/react-start";
import { auth } from "~/server/auth/auth";
import { withDialectMiddleware } from "~/server/middleware/withDialectMiddleware";

const authMap: Map<string, auth> = new Map();

export const withAuthMiddleware = createMiddleware()
	.middleware([
		withDialectMiddleware,
	])
	.server(async ({ next, context: { dialect, dsn } }) => {
		let instance: auth | undefined;

		if (!authMap.has(dsn)) {
			instance = auth(() => dialect);
			authMap.set(dsn, instance);
		}

		if (!instance) {
			throw new Error("Auth not selected!");
		}

		return next({
			context: {
				auth: instance,
			},
		});
	});
