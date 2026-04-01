import { AsyncLocalStorage } from "node:async_hooks";
import { configure, getConsoleSink, getLogger, withContext } from "@logtape/logtape";
import { createMiddleware } from "@tanstack/react-start";
import { genId } from "@/lib/common/gen-id";

export const withLogMiddleware = createMiddleware().server(async ({ next }) => {
	await configure({
		reset: true,
		contextLocalStorage: new AsyncLocalStorage(),
		sinks: {
			console: getConsoleSink(),
		},
		loggers: [
			{
				/**
				 * Root logger
				 */
				category: [],
				lowestLevel: "trace",
				sinks: [
					"console",
				],
			},
			{
				category: "zbav-se.me",
				lowestLevel: "trace",
				sinks: [
					"console",
				],
			},
			{
				category: [
					"logtape",
					"meta",
				],
				lowestLevel: "error",
				sinks: [],
			},
		],
	});

	const traceId = genId();

	return withContext(
		{
			traceId,
		},
		async () => {
			return next({
				context: {
					logger: getLogger("zbav-se.me").with({
						traceId,
					}),
				},
			});
		},
	);
});
