import { createMiddleware } from "@tanstack/react-start";
import { PostgresDialect } from "kysely";
import { Pool } from "~/server/database/pg";
import { databaseRuntimeCache } from "~/server/database/runtime";
import { withDsnMiddleware } from "~/server/middleware/withDsnMiddleware";

export const withDialectMiddleware = createMiddleware()
	.middleware([
		withDsnMiddleware,
	])
	.server(async ({ next, context: { dsn } }) => {
		let instance = databaseRuntimeCache.dialectByDsn.get(dsn);

		if (!instance) {
			console.info("[db] initialising shared PostgresDialect cache");
			instance = new PostgresDialect({
				pool: new Pool({
					connectionString: dsn,
					max: 3,
				}),
			});
			databaseRuntimeCache.dialectByDsn.set(dsn, instance);
		}

		return next({
			context: {
				dialect: instance,
			},
		});
	});
