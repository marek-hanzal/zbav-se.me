import { createMiddleware } from "@tanstack/react-start";
import { type Dialect, PostgresDialect } from "kysely";
import { Pool } from "~/server/database/pg";
import { withDsnMiddleware } from "~/server/middleware/withDsnMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";

const dialectMap = new Map<string, Dialect>();

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

		let instance = dialectMap.get(dsn);

		if (!instance) {
			logger.trace("Creating dialect instance", {
				dsn,
			});

			const pool = new Pool({
				connectionString: dsn,
				max: 3,
			});

			pool.on("error", (error) => {
				logger.warn("Postgres Pool Error", {
					error,
				});
			});

			instance = new PostgresDialect({
				pool,
			});
			dialectMap.set(dsn, instance);
		}

		return next({
			context: {
				dialect: instance,
			},
		});
	});
