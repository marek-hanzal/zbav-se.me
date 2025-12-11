import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { messageCreateFx } from "~/@user/message/fx/messageCreateFx";
import { MessageSchema } from "~/@user/message/schema/MessageSchema";
import { TransactionContextProvider } from "~/@user/transaction/fx/TransactionContextFx";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import type { MessageSchema as ErrorMessageSchema } from "~/schema/MessageSchema";
import { MessageCreateSchema } from "./schema/MessageCreateSchema";

export const withMessageCreateApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/message/create",
			description: "Create a message for a message thread. Requires access to the thread.",
			operationId: "apiMessageCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: MessageCreateSchema,
						},
					},
					description: "Query object for message creation",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Message created",
				},
				403: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Access denied",
				},
				404: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Message thread not found or not accessible",
				},
				500: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"message",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<MessageSchema.Type, 200>(
					yield* messageCreateFx(c.req.valid("json")),
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
									return c.json<ErrorMessageSchema.Type, 404>(
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
									return c.json<ErrorMessageSchema.Type, 403>(
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
									return c.json<ErrorMessageSchema.Type, 500>(
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
									return c.json<ErrorMessageSchema.Type, 500>(
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
