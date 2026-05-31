import { createMiddleware } from "@tanstack/react-start";
import type { Dialect } from "kysely";
import { auth } from "~/server/auth/auth";
import { withDialectMiddleware } from "~/server/middleware/withDialectMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withTranslationMiddleware } from "./withTranslationMiddleware";

const $cache = new WeakMap<Dialect, Map<string, auth>>();

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
		let instance = $read(dialect, locale);

		if (!instance) {
			logger.trace("Creating auth instance", {
				dsn,
				locale,
			});

			instance = auth({
				dialect: () => dialect,
				translator,
			});
			$write(dialect, locale, instance);
		}

		return next({
			context: {
				auth: instance,
			},
		});
	});

function $read(dialect: Dialect, locale: string) {
	return $cache.get(dialect)?.get(locale);
}

function $write(dialect: Dialect, locale: string, instance: auth) {
	const instances = $cache.get(dialect) ?? new Map<string, auth>();

	instances.set(locale, instance);
	$cache.set(dialect, instances);
}
