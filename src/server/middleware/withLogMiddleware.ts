import { AsyncLocalStorage } from "node:async_hooks";
import { getTimeRotatingFileSink } from "@logtape/file";
import {
	configure,
	fingersCrossed,
	getConsoleSink,
	getLogger,
	withContext,
} from "@logtape/logtape";
import { getPrettyFormatter } from "@logtape/pretty";
import { redactByPattern } from "@logtape/redaction";
import { createMiddleware } from "@tanstack/react-start";
import { genId } from "@/lib/common/gen-id";

export const withLogMiddleware = createMiddleware().server(async ({ next }) => {
	await configure({
		reset: true,
		contextLocalStorage: new AsyncLocalStorage(),
		sinks: {
			file: getTimeRotatingFileSink({
				nonBlocking: true,
				directory: "./.logs",
				interval: "hourly",
				/**
				 * 8hrs
				 */
				maxAgeMs: 8 * 60 * 60 * 1_000,
			}),
			console: fingersCrossed(
				getConsoleSink({
					formatter: redactByPattern(
						getPrettyFormatter({
							categoryWidth: 42,
						}),
						[
							// {
							// 	pattern: /postgresql:\/\//g,
							// 	replacement(match, ...rest) {
							// 		return `--${match}--`;
							// 	},
							// },
						],
					),
					nonBlocking: true,
				}),
				{
					triggerLevel: "trace",
					//
					isolateByCategory: "descendant",
					isolateByContext: {
						keys: [
							"traceId",
						],
						bufferTtlMs: 300_000,
						maxContexts: 128,
					},
				},
			),
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
					"file",
				],
			},
			{
				category: "zbav-se.me",
				lowestLevel: "trace",
				sinks: [
					"console",
					"file",
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
