import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { messageCollectionFx } from "~/app/message/fx/messageCollectionFx";
import { MessageQuerySchema } from "~/app/message/schema/MessageQuerySchema";
import { MessageSchema } from "~/app/message/schema/MessageSchema";
import { messageUserCheckFx } from "~/app/message-thread-user/fx/messageUserCheckFx";
import { UserContextFx, UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";

const MessageThreadMessageCollectionParamsSchema = z
	.object({
		messageThreadId: z.string().openapi({
			description: "Message thread identifier",
		}),
	})
	.openapi("MessageThreadMessageCollectionParams", {
		description: "Parameters for message collection within a message thread",
	});

const CollectionSchema = withCollectionSchema({
	schema: MessageSchema,
	type: "MessageCollection",
	description: "Collection of messages",
});

export const withMessageCollectionApi: Routes.Fn = async ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/message-thread/{messageThreadId}/message/collection",
			description:
				"Returns messages for a specific message thread based on provided parameters",
			operationId: "apiMessageThreadMessageCollection",
			request: {
				params: MessageThreadMessageCollectionParamsSchema,
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
				"message-thread",
				"message",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const { messageThreadId } = c.req.valid("param");
				const user = yield* UserContextFx;

				yield* messageUserCheckFx({
					messageThreadId: messageThreadId,
					userIds: [
						user.id,
					],
				});

				return c.json<withCollectionSchema.Type<MessageSchema>, 200>(
					yield* zodFx({
						schema: CollectionSchema,
						dataFx: messageCollectionFx({
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
				DatabaseContextProvider(c.get("database")),
				UserContextProvider(c.get("user")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => {
									return c.json<NoticeSchema.Type, 404>(
										{
											type: "error",
											message: e.message,
										},
										404,
									);
								},
							),
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								() => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: e.message,
										},
										500,
									);
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
};
