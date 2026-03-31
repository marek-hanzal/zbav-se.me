import { createMiddleware } from "@tanstack/react-start";
import { auth } from "~/server/auth/auth";
import { databaseRuntimeCache } from "~/server/database/runtime";
import { withDialectMiddleware } from "~/server/middleware/withDialectMiddleware";

export const withAuthMiddleware = createMiddleware()
	.middleware([
		withDialectMiddleware,
	])
	.server(async ({ next, context: { dialect, dsn } }) => {
		let instance = databaseRuntimeCache.authByDsn.get(dsn);

		if (!instance) {
			console.info("[auth] initialising shared BetterAuth cache");
			instance = auth(() => dialect);
			databaseRuntimeCache.authByDsn.set(dsn, instance);
		}

		return next({
			context: {
				auth: instance,
			},
		});
	});
