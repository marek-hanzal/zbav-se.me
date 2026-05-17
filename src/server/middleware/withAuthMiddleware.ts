import { createMiddleware } from "@tanstack/react-start";
import { auth } from "~/server/auth/auth";
import { withDialectMiddleware } from "~/server/middleware/withDialectMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withTranslationMiddleware } from "./withTranslationMiddleware";

const authMap = new Map<string, auth>();

export const withAuthMiddleware = createMiddleware()
	.middleware([
		withLogMiddleware,
		withDialectMiddleware,
		withTranslationMiddleware,
	])
	.server(async ({ next, context: { dialect, dsn, rootLogger, locale, translator } }) => {
		const logger = rootLogger.getChild([
			"middleware",
			"withAuthMiddleware",
		]);
		const cacheKey = `${dsn}:${locale}`;
		let instance = authMap.get(cacheKey);

		if (!instance) {
			logger.trace("Creating auth instance", {
				dsn,
				locale,
			});

			instance = auth({
				dialect: () => dialect,
				translator,
			});
			authMap.set(cacheKey, instance);
		}

		return next({
			context: {
				auth: instance,
			},
		});
	});
