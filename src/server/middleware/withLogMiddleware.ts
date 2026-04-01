import { AsyncLocalStorage } from "node:async_hooks";
import { getTimeRotatingFileSink } from "@logtape/file";
import {
	configure,
	fingersCrossed,
	getConsoleSink,
	getLogger,
	jsonLinesFormatter,
	withContext,
} from "@logtape/logtape";
import { getPrettyFormatter } from "@logtape/pretty";
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
				formatter: jsonLinesFormatter,
			}),
			console: fingersCrossed(
				getConsoleSink({
					formatter: getPrettyFormatter({
						categoryWidth: 42,
						properties: true,
					}),
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

	const context = {
		traceId: genId(),
	} as const;

	return withContext(context, async () => {
		return next({
			context: {
				rootLogger: getLogger("zbav-se.me").with(context),
			},
		});
	});
});
