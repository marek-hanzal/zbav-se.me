import { createMiddleware } from "@tanstack/react-start";
import { type Dialect, PostgresDialect } from "kysely";
import { Pool } from "~/server/database/pg";
import { withDsnMiddleware } from "~/server/middleware/withDsnMiddleware";

const dialectMap: Map<string, Dialect> = new Map();

export const withDialectMiddleware = createMiddleware()
	.middleware([
		withDsnMiddleware,
	])
	.server(async ({ next, context: { dsn } }) => {
		let instance: Dialect | undefined;

		if (!dialectMap.has(dsn)) {
			instance = new PostgresDialect({
				pool: new Pool({
					connectionString: dsn,
					max: 3,
				}),
			});
			dialectMap.set(dsn, instance);
		}

		if (!instance) {
			throw new Error("Dialect not selected!");
		}

		return next({
			context: {
				dialect: instance,
			},
		});
	});
