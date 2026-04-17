import { AsyncLocalStorage } from "node:async_hooks";
import { getTimeRotatingFileSink } from "@logtape/file";
import {
	configure,
	fingersCrossed,
	getConsoleSink,
	jsonLinesFormatter,
	type LogLevel,
	withContext,
} from "@logtape/logtape";
import { getPrettyFormatter } from "@logtape/pretty";
import { createMiddleware } from "@tanstack/react-start";
import { genId } from "@/lib/common/gen-id";
import { getRootLogger } from "~/common/log/getRootLogger";
import { RootLoggerName } from "~/common/log/RootLoggerName";
import { withDevEnvMiddleware } from "~/server/middleware/withDevEnvMiddleware";

const contextLocalStorage = new AsyncLocalStorage<Record<string, unknown>>();

let flag = true;

export const withLogMiddleware = createMiddleware()
	.middleware([
		withDevEnvMiddleware,
	])
	.server(async ({ next, context: { isDev } }) => {
		const level: LogLevel = "trace";

		flag &&
			(await configure({
				reset: true,
				contextLocalStorage,
				sinks: {
					file: isDev
						? getTimeRotatingFileSink({
								nonBlocking: true,
								directory: "./.logs",
								interval: "hourly",
								//
								maxAgeMs: 4 * 60 * 60 * 1_000,
								formatter: jsonLinesFormatter,
							})
						: () => {},
					console: fingersCrossed(
						getConsoleSink({
							formatter: isDev
								? getPrettyFormatter({
										categoryWidth: 64,
										properties: true,
										timestamp: "date-time-tz",
										messageColor: "white",
									})
								: jsonLinesFormatter,
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
						lowestLevel: level,
						sinks: [
							"console",
							"file",
						],
					},
					{
						category: RootLoggerName,
						lowestLevel: level,
						sinks: [
							"file",
						],
					},
					{
						category: [
							RootLoggerName,
							"middleware",
						],
						lowestLevel: level,
						sinks: [
							"file",
						],
					},
					{
						category: [
							RootLoggerName,
							"fn",
						],
						lowestLevel: level,
						sinks: [
							"console",
						],
					},
					{
						category: [
							RootLoggerName,
							"fx",
						],
						lowestLevel: level,
						sinks: [
							"console",
						],
					},
					//
					{
						category: [
							"logtape",
							"meta",
						],
						lowestLevel: "error",
						sinks: [],
					},
				],
			}));

		flag = false;

		const context = {
			traceId: genId(),
		} as const;

		return withContext(context, async () => {
			return next({
				context: {
					rootLogger: getRootLogger().with(context),
				},
			});
		});
	});
