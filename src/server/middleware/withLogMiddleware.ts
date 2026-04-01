import { configure, getConsoleSink } from "@logtape/logtape";
import { createMiddleware } from "@tanstack/react-start";

export const withLogMiddleware = createMiddleware().server(async ({ next }) => {
	await configure({
		sinks: {
			console: getConsoleSink(),
		},
		loggers: [
			{
				//
				category: "zbav-se.me",
				lowestLevel: "info",
				sinks: [
					"console",
				],
			},
			// {
			//     category: [],
			// }
		],
	});

	return next();
});
