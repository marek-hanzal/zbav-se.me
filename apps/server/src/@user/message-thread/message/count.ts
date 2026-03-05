import { createRoute, z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { messageCountFx } from "~/@user/message/fx/messageCountFx";
import { MessageCountQuerySchema } from "~/@user/message/schema/MessageCountQuerySchema";
import { messageUserCheckFx } from "~/@user/message-thread-user/fx/messageUserCheckFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { CountSchema } from "~/schema/CountSchema";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

const ParamsSchema = z
	.object({
		messageThreadId: z.string().openapi({
			description: "Message thread identifier",
		}),
	})
	.openapi("MessageThreadMessageCountParams", {
		description: "Parameters for message count within a message thread",
	});

export const withMessageCountApiFx = Effect.fn("withMessageCountApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/message-thread/{messageThreadId}/message/count",
			description: "Returns count of messages for a specific message thread",
			operationId: "apiMessageThreadMessageCount",
			request: {
				params: ParamsSchema,
				body: {
					content: {
						"application/json": {
							schema: MessageCountQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CountSchema,
						},
					},
					description: "Return counts based on provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Message thread not found or not accessible",
				},
				500: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"Message Thread",
			],
			summary: "Count messages in a message thread based on the provided query",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const { messageThreadId } = c.req.valid("param");
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiMessageThreadMessageCount",
					userId: user.id,
				});

				yield* messageUserCheckFx({
					messageThreadId,
					userIds: [
						user.id,
					],
				});

				return c.json(
					yield* zodGuardFx({
						schema: CountSchema,
						dataFx: messageCountFx({
							...c.req.valid("json"),
							userId: user.id,
							scope: {
								messageThreadId,
							},
						}),
					}),
					200,
				);
			}).pipe(
				withLoggingFx(axiomConfig, "apiMessageThreadMessageCount", c.get("traceId")),
				withKyselyFx(c.get("kysely")),
				withCatchFx({
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					RuntimeErrorFx(e) {
						return c.json(noticeError(e as Error), 500);
					},
					ZodErrorFx({ zod }) {
						return c.json(noticeZodError(zod), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
