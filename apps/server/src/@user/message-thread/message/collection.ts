import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { messageCollectionFx } from "~/@user/message/fx/messageCollectionFx";
import { MessageQuerySchema } from "~/@user/message/schema/MessageQuerySchema";
import { MessageItemSchema } from "~/@user/message-thread/message/schema/MessageItemSchema";
import { messageUserCheckFx } from "~/@user/message-thread-user/fx/messageUserCheckFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

const ParamsSchema = z
	.object({
		messageThreadId: z.string().openapi({
			description: "Message thread identifier",
		}),
	})
	.openapi("MessageThreadMessageCollectionParams", {
		description: "Parameters for message collection within a message thread",
	});

const CollectionSchema = withCollectionSchema({
	schema: MessageItemSchema,
	type: "MessageItemSchema",
	description: "Collection of messages",
});

export const withMessageCollectionApiFx = Effect.fn("withMessageCollectionApiFx")(function* () {
	const { userHono } = yield* RoutesContextFx;
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/message-thread/{messageThreadId}/message/collection",
			description:
				"Returns messages for a specific message thread based on provided parameters",
			operationId: "apiMessageThreadMessageCollection",
			request: {
				params: ParamsSchema,
				body: {
					content: {
						"application/json": {
							schema: MessageQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CollectionSchema,
						},
					},
					description: "Access collection of messages based on provided query",
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
			summary:
				"Fetch a collection of messages for a message thread based on the provided query",
		}),
		async (c) => {
			const axiomConfig = ServerAxiomSchema.parse(process.env);

			return Effect.gen(function* () {
				const { messageThreadId } = c.req.valid("param");
				const user = c.get("user");

				yield* Effect.annotateLogsScoped({
					endpoint: "apiMessageThreadMessageCollection",
					userId: user.id,
				});

				yield* messageUserCheckFx({
					messageThreadId: messageThreadId,
					userIds: [
						user.id,
					],
				});

				const result = c.json<z.infer<typeof CollectionSchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: messageCollectionFx({
							...c.req.valid("json"),
							userId: user.id,
							scope: {
								messageThreadId,
							},
						}) satisfies Effect.Effect<
							withCollectionSchema.Type<MessageItemSchema>,
							any,
							any
						>,
					}),
					200,
				);

				yield* Effect.log("apiMessageThreadMessageCollection");

				return result;
			}).pipe(
				withLoggingFx(axiomConfig),
				withKyselyFx(c.get("kysely")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => {
									return c.json(NotFoundNotice, 404);
								},
							),
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								({ zod }) => {
									return c.json(noticeZodError(zod), 500);
								},
							),
							Match.exhaustive,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
});
