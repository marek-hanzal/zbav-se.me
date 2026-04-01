import { createMiddleware } from "@tanstack/react-start";
import { type Dialect, PostgresDialect } from "kysely";
import { Pool } from "~/server/database/pg";
import { withDsnMiddleware } from "~/server/middleware/withDsnMiddleware";

const dialectMap = new Map<string, Dialect>();

export const withDialectMiddleware = createMiddleware()
	.middleware([
		withDsnMiddleware,
	])
	.server(async ({ next, context: { dsn } }) => {
		let instance = dialectMap.get(dsn);

		if (!instance) {
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
