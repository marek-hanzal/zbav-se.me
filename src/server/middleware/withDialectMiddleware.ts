import { createMiddleware } from "@tanstack/react-start";
import { DialectStore } from "~/server/database/DialectStore";
import { withDsnMiddleware } from "~/server/middleware/withDsnMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";

export const withDialectMiddleware = createMiddleware()
	.middleware([
		withLogMiddleware,
		withDsnMiddleware,
	])
	.server(async ({ next, context: { dsn, rootLogger } }) => {
		const logger = rootLogger.getChild([
			"middleware",
			"withDialectMiddleware",
		]);

		const instance = DialectStore.createPool({
			dsn,
			pool: {
				max: 3,
			},
			onError(error) {
				logger.warn("Postgres Pool Error", {
					error,
				});
			},
		});

		return next({
			context: {
				dialect: instance,
			},
		});
	});
