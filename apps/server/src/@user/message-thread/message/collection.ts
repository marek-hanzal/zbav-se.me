import { createRoute, z } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { messageCollectionFx } from "~/app/message/fx/messageCollectionFx";
import { MessageQuerySchema } from "~/app/message/schema/MessageQuerySchema";
import { messageUserCheckFx } from "~/app/message-thread-user/fx/messageUserCheckFx";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";
import { MessageItemSchema } from "./schema/MessageItemSchema";

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
				"message-thread",
				"message",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const { messageThreadId } = c.req.valid("param");
				const user = c.get("user");

				yield* messageUserCheckFx({
					messageThreadId: messageThreadId,
					userIds: [
						user.id,
					],
				});

				return c.json<z.infer<typeof CollectionSchema>, 200>(
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
			}).pipe(
				Effect.provide(KyselyContextLayer(c.get("kysely"))),
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
								({ zod }) => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: z.prettifyError(zod),
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
});
