import { configure, getConsoleSink } from "@logtape/logtape";
import { createMiddleware } from "@tanstack/react-start";

export const withLogMiddleware = createMiddleware().server(async ({ next }) => {
	await configure({
		reset: true,
		sinks: {
			console: getConsoleSink(),
		},
		loggers: [
			{
				category: "zbav-se.me",
				lowestLevel: "debug",
				sinks: [
					"console",
				],
			},
			{
				category: [
					"logtape",
					"meta",
				],
				lowestLevel: "debug",
				sinks: [
					// "console",
				],
			},
		],
	});

	return next();
});
