import type { AgentInputItem, RunStreamEvent } from "@openai/agents";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { AssistantAgent } from "~/user/agent/AssistantAgent";
import { MaxTurns } from "~/user/agent/model/MaxTurns";
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
			async POST({ request, context: { user, rootLogger, runner, session } }) {
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
							try {
								const stream = await runner.run(AssistantAgent, input.data, {
									session,
									stream: true,
									signal: request.signal,
									maxTurns: MaxTurns,
								});

								try {
									for await (const event of stream) {
										controller.enqueue(
											encoder.encode(
												`data: ${JSON.stringify(event as RunStreamEvent)}\n\n`,
											),
										);
									}

									await stream.completed;

									controller.close();
								} catch (error) {
									try {
										await stream.completed;
									} catch (error) {
										logger.error("Agent stream completion failed", {
											userId: user.id,
											error: error,
										});
									}

									throw error;
								}
							} catch (error) {
								logger.error("Agent stream failed", {
									userId: user.id,
									error,
								});

								controller.close();
							}
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
