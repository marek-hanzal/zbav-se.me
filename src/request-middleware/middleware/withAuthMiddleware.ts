import { createMiddleware } from "@tanstack/react-start";
import type { Dialect } from "kysely";
import { authFn } from "~/authentication/fn/authFn";
import { withDialectMiddleware } from "~/request-middleware/middleware/withDialectMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withTranslationMiddleware } from "~/request-middleware/middleware/withTranslationMiddleware";

const $cache = new WeakMap<Dialect, Map<string, authFn>>();

export const withAuthMiddleware = createMiddleware()
	.middleware([
		withLogMiddleware,
		withDialectMiddleware,
		withTranslationMiddleware,
	])
	.server(async ({ next: nextFn, context: { dialect, dsn, rootLogger, locale, translator } }) => {
		const logger = rootLogger.getChild([
			"middleware",
			"withAuthMiddleware",
		]);
		let instance = $readFn(dialect, locale);

		if (!instance) {
			logger.trace("Creating auth instance", {
				dsn,
				locale,
			});

			instance = authFn({
				dialectFn: () => dialect,
				translator,
			});
			$writeFn(dialect, locale, instance);
		}

		return nextFn({
			context: {
				auth: instance,
			},
		});
	});

function $readFn(dialect: Dialect, locale: string) {
	return $cache.get(dialect)?.get(locale);
}

function $writeFn(dialect: Dialect, locale: string, instance: authFn) {
	const instances = $cache.get(dialect) ?? new Map<string, authFn>();

	instances.set(locale, instance);
	$cache.set(dialect, instances);
}
