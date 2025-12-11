import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { messageTextCreateFx } from "~/@user/message-text/fx/messageCreateFx";
import { MessageTextSchema } from "~/@user/message-text/schema/MessageTextSchema";
import { TransactionContextProvider } from "~/@user/transaction/fx/TransactionContextFx";
import { MessageTextCreateSchema } from "~/app/message-text/schema/MessageTextCreateSchema";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import type { NoticeSchema } from "~/schema/NoticeSchema";

export const withMessageTextCreateApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/message-text/create",
			description:
				"Create a message text for a message thread. Requires access to the thread.",
			operationId: "apiMessageTextCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: MessageTextCreateSchema,
						},
					},
					description: "Query object for message creation",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: MessageTextSchema,
						},
					},
					description: "Message created",
				},
				403: {
					content: {
						"application/json": {
							schema: MessageTextSchema,
						},
					},
					description: "Access denied",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageTextSchema,
						},
					},
					description: "Message thread not found or not accessible",
				},
				500: {
					content: {
						"application/json": {
							schema: MessageTextSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"message-text",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<MessageTextSchema.Type, 200>(
					yield* messageTextCreateFx(c.req.valid("json")),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				TransactionContextProvider(),
				UserContextProvider(c.get("user")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundError",
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
									_tag: "AccessDeniedError",
								},
								() => {
									return c.json<NoticeSchema.Type, 403>(
										{
											type: "error",
											message: e.message,
										},
										403,
									);
								},
							),
							Match.when(
								{
									_tag: "RuntimeError",
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
							Match.when(
								{
									_tag: "UnknownException",
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
