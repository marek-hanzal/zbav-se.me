import type { AgentInputItem, RunStreamEvent } from "@openai/agents";
import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { z } from "zod";
import { withLoggerFx } from "@/lib/common/log";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { AssistantAgent } from "~/user/agent/AssistantAgent";
import { MaxTurns } from "~/user/agent/model/MaxTurns";
import { agentUsageCreateFx } from "~/user/agent/server/fx/agentUsageCreateFx";
import { withRunnerMiddleware } from "~/user/agent/server/middleware/withRunnerMiddleware";
import { withRunnerSessionMiddleware } from "~/user/agent/server/middleware/withRunnerSessionMiddleware";

const AgentRequestSchema: z.ZodType<string | AgentInputItem[]> = z
	.union([
		z.string(),
		z.array(z.unknown()).transform((items) => items as AgentInputItem[]),
	])
	.meta({
		id: "AgentRequest",
		description: "Request body accepted by the assistant streaming endpoint",
	});

const encoder = new TextEncoder();

export const Route = createFileRoute("/api/user/agent")({
	server: {
		middleware: [
			withUserMiddleware,
			withRunnerSessionMiddleware,
			withRunnerMiddleware,
		],
		handlers: {
			async POST({ request, context: { database, user, rootLogger, runner, session } }) {
				const logger = rootLogger.getChild("/api/user/agent");

				const input = AgentRequestSchema.safeParse(await request.json());

				if (!input.success) {
					return Response.json(
						{
							error: "Invalid request body",
							issues: input.error.issues,
						},
						{
							status: 400,
						},
					);
				}

				return new Response(
					new ReadableStream<Uint8Array<ArrayBuffer>>({
						async start(controller) {
							const run = runner.run(AssistantAgent, input.data, {
								session,
								stream: true,
								signal: request.signal,
								maxTurns: MaxTurns,
							});

							return Effect.gen(function* () {
								const { stream, threadId } = yield* Effect.promise(async () => {
									const stream = await run;
									const threadId = await session.getSessionId();

									for await (const event of stream) {
										controller.enqueue(
											encoder.encode(
												`data: ${JSON.stringify(event as RunStreamEvent)}\n\n`,
											),
										);
									}

									await stream.completed;

									return {
										stream,
										threadId,
									};
								});

								yield* agentUsageCreateFx({
									userId: user.id,
									threadId,
									requests: stream.state.usage.requests,
									input: stream.state.usage.inputTokens,
									total: stream.state.usage.totalTokens,
									output: stream.state.usage.outputTokens,
								}).pipe(
									Effect.catchAll((error) =>
										Effect.sync(() => {
											logger.error("Agent usage persistence failed", {
												userId: user.id,
												threadId,
												error,
											});
										}),
									),
								);

								yield* Effect.sync(() => {
									controller.close();
								});
							}).pipe(
								withLoggerFx(rootLogger),
								withKyselyFx(database),
								withDateFx,
								Effect.catchAll((error) =>
									Effect.gen(function* () {
										yield* Effect.promise(() =>
											run
												.then((stream) => stream.completed)
												.catch((error) => {
													logger.error("Agent stream completion failed", {
														userId: user.id,
														error,
													});
												}),
										);

										yield* Effect.sync(() => {
											logger.error("Agent stream failed", {
												userId: user.id,
												error,
											});

											controller.close();
										});
									}),
								),
								Effect.runPromise,
							);
						},
						async cancel() {
							// request.signal should already propagate disconnect/abort
						},
					}),
					{
						headers: {
							"Content-Type": "text/event-stream; charset=utf-8",
							"Cache-Control": "no-cache, no-transform",
							Connection: "keep-alive",
							"X-Accel-Buffering": "no",
						},
					},
				);
			},
		},
	},
});
