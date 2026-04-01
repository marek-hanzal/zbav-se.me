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
	.server(async ({ next, context: { dsn, logger } }) => {
		let instance = dialectMap.get(dsn);

		if (!instance) {
			logger.debug("Creating dialect instance", {
				dsn,
			});

			instance = new PostgresDialect({
				pool: new Pool({
					connectionString: dsn,
					max: 3,
				}),
			});
			dialectMap.set(dsn, instance);
		}

		return next({
			context: {
				dialect: instance,
			},
		});
	});
